from django.shortcuts import render
from django.http import HttpRequest,JsonResponse, HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect
import requests
from django.db.models import F
from django.conf import settings
from userman.models import Player
from django.utils.crypto import get_random_string
from django.contrib.auth import login
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

def discord_login(HttpRequest):
	return redirect(settings.F_URI)


def discord_redirect(request: HttpRequest):
	code = request.GET.get('code')
	print("***********************************")
	print(code)
	print("***********************************")
	if code:
		access_token = exchange_code(code)
		if access_token:
			user_info_response = requests.get("https://api.intra.42.fr/v2/me/", headers={
				"Authorization": f"Bearer {access_token}"
			})
			user_info = user_info_response.json()
			email = user_info.get('email')
			username = user_info.get('login')
			fname = user_info.get('first_name')
			lname = user_info.get('last_name')
			image = user_info.get('image')['link']
			
			conflicting_user_mail = Player.objects.filter(email=email).exclude(user_type=Player.USER_42).first()
			conflicting_user_user = Player.objects.filter(username=username).exclude(user_type=Player.USER_42).first()
			if   conflicting_user_mail or conflicting_user_user:
				return redirect("http://localhost:5173/403")
			user = Player.objects.filter(username=username).first()
			if not user:
				random_password = get_random_string(length=12)
				user = Player.objects.create(
					email=email,
					username=username,
					first_name=fname,
					last_name=lname,
					image=image,
					user_type=Player.USER_42
				)
				user.set_password(random_password)
				user.save()
				
			if user is not None:
				login(request, user)
				refresh = RefreshToken.for_user(user)
				request.session['access'] = str(refresh.access_token)
				data = {
					'access' : refresh.access_token,
					'refresh' : refresh
				}
				request.session['access'] = str(refresh.access_token)
				request.session['refresh'] = str(refresh)
				# request.session['refresh'] = refresh
				set_cookie(request=request)
				# print("++++++++++++++++++++++++++|", request.COOKIES['access'])
				return redirect('http://localhost:2500/42/set-cookie')
			else:
				return JsonResponse({'error': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)
		else:
			return JsonResponse({'error': 'Failed to exchange code for access token'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return JsonResponse({'error': 'No code parameter received'}, status=status.HTTP_400_BAD_REQUEST)


def set_cookie(request):
	access_token = request.session.get('access')
	refresh_token = request.session.get('refresh')

	if access_token and refresh_token:
		response = HttpResponseRedirect('http://localhost:5173/')
		response.set_cookie('access', access_token)
		response.set_cookie('refresh', refresh_token)
		return response
	else:
		return HttpResponse("Access or Refresh token not found in session.")


def exchange_code(code: str):

	print("*********************************")
	print(F"hada l code {code}")
	print("*********************************")

	data = {
		"client_id": settings.F_CLIENT_ID,
		"client_secret" : settings.F_CLIENT_SECRET,
		"grant_type": settings.F_GRANT_TYPE,
		"code": code,
		"redirect_uri": settings.F_REDIRECT_URI,
		# "scope": settings.F_SCOPE,
	}
	print("------------------------")
	print(f"hadi l body dial req : {data}")
	print("------------------------")

	response = requests.post("https://api.intra.42.fr/oauth/token", data=data)
	print("------------------------")
	print(f"hadi l body dial res: {response.content}")
	print("------------------------")
	print(">>>>>>>|", response.content)
	credentials = response.json()
	access_token = credentials.get('access_token')
	return access_token