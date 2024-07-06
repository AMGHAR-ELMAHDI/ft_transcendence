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





def home(HttpRequest):
    return(JsonResponse({'msg' : 'hi there'}))

def discord_login(HttpRequest):
	return redirect(settings.URI)


# Function to handle Discord login redirect
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

            user = Player.objects.filter(email=email).first()
            if not user:
                random_password = get_random_string(length=12)
                user = Player.objects.create(
                    email=email,
                    username=username
                )
                user.set_password(random_password)
                user.save()
                
            user = Player.objects.filter(email=email).first()
            if user is not None:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            else:
                return JsonResponse({'error': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return JsonResponse({'error': 'Failed to exchange code for access token'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({'error': 'No code parameter received'}, status=status.HTTP_400_BAD_REQUEST)


def exchange_code(code: str):
    data = {
        "client_id": settings.CLIENT_ID,
		"client_secret" : settings.CLIENT_SECRET,
        "grant_type": settings.GRANT_TYPE,
        "code": code,
        "redirect_uri": settings.REDIRECT_URI,
        "scope": settings.SCOPE,
    }
    headers = {
        'Content-type': 'application/x-www-form-urlencoded'
    }
    response = requests.post("https://discord.com/api/oauth2/token", data=data, headers=headers)
    credentials = response.json()
    access_token = credentials.get('access_token')
    return access_token