import os
from django.core.asgi import get_asgi_application
from django.urls import path,re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from chat.chat_consumer import ChatConsumer
from online import consumers 
from chat.status_consumer import StatusConsumer
from chat.blockUnblock_consumer import BlockUnblockConsumer
from chat.friend_requests_consumer import FriendshipRequestConsumer
from chat.SingleGame_consumer import RequestSingleGameConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myChat.settings')

application = ProtocolTypeRouter({
  'http': get_asgi_application(),
  'websocket': URLRouter([
      re_path(r'game/host/socket-server/', consumers.GameConsumer.as_asgi()),
	    re_path(r'ws/game/tn/', consumers.TournamentM_.as_asgi()),
      #path("ws/chat/<int:receiver_id>/", ChatConsumer.as_asgi()),
      path("ws/chat/<int:receiver_id>/<str:token>", ChatConsumer.as_asgi()),
      path("ws/status/<str:token>/<int:type>", StatusConsumer.as_asgi()),
	    path('ws/block-unblock/<str:token>', BlockUnblockConsumer.as_asgi()),
	    path('ws/friend-reqs/<str:token>', FriendshipRequestConsumer.as_asgi()),
	    path('ws/single-game/<str:token>', RequestSingleGameConsumer.as_asgi()),
  ]
    ),
})