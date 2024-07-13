from django.urls import path, include

from .views_42 import *
from .views_ds import *

urlpatterns = [
    path('discord/login/', discord_login, name='discord-login'),
    path('discord/login/redirect', discord_redirect.as_view(), name='discord-redirect'),
    path('discord/2fa/', Discord_2faView.as_view(), name='discord-2fa'),

    path('42/login/', f42_login, name='42-login'),
    path('42/login/redirect', f42_redirect, name='42-redirect'),

    path('oauth2/set-cookie', set_cookie, name='set-cookie'),
    
]