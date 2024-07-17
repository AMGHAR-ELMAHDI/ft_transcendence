from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseRedirect
from django.shortcuts import redirect
import requests
from django.db.models import F
from django.conf import settings
from userman.models import Player
from django.utils.crypto import get_random_string
from django.contrib.auth import  login
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django_otp import user_has_device
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


def discord_login(HttpRequest):
	return redirect(settings.D_URI)

def user_has_device(user):
	return TOTPDevice.objects.filter(user=user, confirmed=True).exists()

class discord_redirect(APIView):
	permission_classes = [AllowAny]
	def get(self, request):
		code = request.GET.get('code')
		if code:
			access_token = exchange_code(code)
			if access_token:
				user_info_response = None
				user_info_response = requests.get("https://discord.com/api/v6/users/@me", headers={
					"Authorization": f"Bearer {access_token}"
				})
				if user_info_response == None:
						return Response ({"Error" : "empty response"}, status=status.HTTP_400_BAD_REQUEST)
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
					if user_has_device(user):
						request.session['pre_2fa_user_id'] = user.id
						return redirect(f'http://localhost:5173/twoFa2?user_id={user.id}')
					else:
						login(request, user)
						refresh = RefreshToken.for_user(user)
						request.session['access'] = str(refresh.access_token)
						request.session['refresh'] = str(refresh)
						return HttpResponseRedirect(redirect_to='https://localhost:2500/oauth2/set-cookie')
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

class Discord_2faView(APIView):
	permission_classes = [AllowAny]
	
	def get(self, request):
		return Response({'status' : 'Enter the 2FA CODE'})

	def post(self, request):
		user_id = request.data.get('user_id')
		if not user_id:
			return Response({'error': 'No user in session'}, status=status.HTTP_400_BAD_REQUEST)
		
		user = Player.objects.get(id=user_id)
		code = request.data.get('code')
		device = TOTPDevice.objects.filter(user=user, confirmed=True).first()

		if device and device.verify_token(code):
			login(request, user)
			refresh = RefreshToken.for_user(user)
			access = str(refresh.access_token)
			refresh = str(refresh)
			return Response({'access' : str(access), 'refresh' : refresh}, status=status.HTTP_200_OK)
		return Response({'error': 'Invalid 2FA code'}, status=status.HTTP_400_BAD_REQUEST)
	

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