from django.urls import path, include

from .views import *

urlpatterns = [
    path('home/', home, name='discord-home'),
    path('login/', discord_login, name='discord-login'),
    path('login/redirect', discord_redirect, name='discord-redirect'),
]