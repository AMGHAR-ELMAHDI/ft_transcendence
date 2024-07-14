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
from django_otp import user_has_device


def f42_login(HttpRequest):
	return redirect(settings.F_URI)


def f42_redirect(request: HttpRequest):
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
				return redirect(settings.HTTP_403_FORBIDDEN)
			user = Player.objects.filter(username=username).first()
			if not user:
				random_password = get_random_string(length=12)
				user = Player.objects.create(
					email=email,
					username=username,
					user_type=Player.USER_42
				)
				user.set_password(random_password)
				user.save()
			if user is not None:
				if user_has_device(user):
					request.session['pre_2fa_user_id'] = user.id
					print('[SignInAPIView] there is a device')
					return redirect(f'http://localhost:5173/twoFa2?user_id={user.id}')
					# return redirect('http://localhost:2500/discord/2fa')
				else:
					login(request, user)
					refresh = RefreshToken.for_user(user)
					request.session['access'] = str(refresh.access_token)
					request.session['refresh'] = str(refresh)
					return HttpResponseRedirect(redirect_to='http://localhost:2500/oauth2/set-cookie')
			else:
				return redirect (settings.HTTP_401_UNAUTHORIZED)
		else:
			return redirect (settings.HTTP_400_BAD_REQUEST)
	else:
		return redirect (settings.HTTP_400_BAD_REQUEST)





def exchange_code(code: str):
	data = {
		"client_id": settings.F_CLIENT_ID,
		"client_secret" : settings.F_CLIENT_SECRET,
		"grant_type": settings.F_GRANT_TYPE,
		"code": code,
		"redirect_uri": settings.F_REDIRECT_URI,
		# "scope": settings.F_SCOPE,
	}

	response = requests.post("https://api.intra.42.fr/oauth/token", data=data)
	credentials = response.json()
	access_token = credentials.get('access_token')
	return access_token