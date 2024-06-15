import os
from django.core.asgi import get_asgi_application
from django.urls import path,re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from chat.consumers import ChatConsumer
from online import consumers 
from userman.consumers import StatusConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myChat.settings')

application = ProtocolTypeRouter({
  'http': get_asgi_application(),
  'websocket': URLRouter([
      re_path(r'game/host/socket-server/', consumers.GameConsumer.as_asgi()),
	    re_path(r'ws/game/tn/', consumers.TournamentM_.as_asgi()),
      #path("ws/chat/<int:receiver_id>/", ChatConsumer.as_asgi()),
      path("ws/chat/<int:receiver_id>/<str:token>", ChatConsumer.as_asgi()),
      path("ws/status/<str:token>", StatusConsumer.as_asgi()),
  ]
    ),
})