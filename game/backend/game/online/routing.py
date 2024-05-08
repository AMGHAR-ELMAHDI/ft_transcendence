from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
	re_path(r'game/host/socket-server/', consumers.GameConsumer.as_asgi()),
	re_path(r'tournament/host/socket-server/', consumers.TournamentM_.as_asgi())
];