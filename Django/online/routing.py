from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
	re_path(r'game/host/socket-server/<str:token>', consumers.GameConsumer.as_asgi()),
	# re_path(r'ws/game/tn/<str:token>', consumers.TournamentM_.as_asgi())
]