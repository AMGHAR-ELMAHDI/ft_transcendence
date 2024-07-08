from django.urls import re_path
from . import consumers, consumers2

websocket_urlpatterns = [
	re_path(r'game-invite/<int:>/', consumers.GameConsumer.as_asgi()),
	# re_path(r'game/online_opp/', consumers2.GameConsumer_2.as_asgi()),
	re_path(r'ws/game/tn/', consumers.TournamentM_.as_asgi())
]