from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import redirect
import requests
from django.db.models import F
from django.conf import settings
from userman.models import Player
from django.utils.crypto import get_random_string
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from Oauth42.views import set_cookie
def discord_login(HttpRequest):
	return redirect(settings.D_URI)


def discord_redirect(request: HttpRequest):
	code = request.GET.get('code')
	if code:
		access_token = exchange_code(code)
		if access_token:
			user_info_response = requests.get("https://discord.com/api/v6/users/@me", headers={
				"Authorization": f"Bearer {access_token}"
			})
			user_info = user_info_response.json()
			discord_id = user_info.get('id')
			email = user_info.get('email')
			username = user_info.get('username')
			conflicting_user_mail = Player.objects.filter(email=email).exclude(user_type=Player.USER_DISCORD).first()
			conflicting_user_user = Player.objects.filter(username=username).exclude(user_type=Player.USER_DISCORD).first()
			if   conflicting_user_mail or conflicting_user_user:
				return JsonResponse({'error': 'User with conflicting user type exists'}, status=status.HTTP_403_FORBIDDEN)
			user = Player.objects.filter(username=username).first()
			if not user:
				random_password = get_random_string(length=12)
				user = Player.objects.create(
					email=email,
					username=username,
					user_type=Player.USER_DISCORD
				)
				user.set_password(random_password)
				user.save()
				
			if user is not None:
				login(request, user)
				refresh = RefreshToken.for_user(user)
				request.session['access'] = str(refresh.access_token)
				request.session['refresh'] = str(refresh)
				set_cookie(request=request)
				return redirect('http://localhost:2500/42/set-cookie')
			else:
				return redirect (settings.HTTP_401_UNAUTHORIZED)
		else:
			return redirect (settings.HTTP_400_BAD_REQUEST)
	else:
		return redirect (settings.HTTP_400_BAD_REQUEST)

def exchange_code(code: str):
	data = {
		"client_id": settings.D_CLIENT_ID,
		"client_secret" : settings.D_CLIENT_SECRET,
		"grant_type": settings.D_GRANT_TYPE,
		"code": code,
		"redirect_uri": settings.D_REDIRECT_URI,
		"scope": settings.D_SCOPE,
	}
	headers = {
		'Content-type': 'application/x-www-form-urlencoded'
	}
	response = requests.post("https://discord.com/api/oauth2/token", data=data, headers=headers)
	credentials = response.json()
	access_token = credentials.get('access_token')
	return access_token