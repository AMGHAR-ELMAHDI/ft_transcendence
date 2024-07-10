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
from online.consumers import TournamentM_
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myChat.settings')

# from chat.StartGame_consumer import StartGame_consumer

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
	    path('ws/game-tn/<str:token>', TournamentM_.as_asgi()),
	    path('ws/remote/<str:token>', consumers.GameConsumer.as_asgi()),
	    # path('ws/start-single-game/<str:token>/<str:room>', StartGame_consumer.as_asgi()),
  ]
    ),
})