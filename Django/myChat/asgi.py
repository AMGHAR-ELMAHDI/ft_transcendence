# import os
# from django.core.asgi import get_asgi_application
# from django.urls import path,re_path
# from channels.routing import ProtocolTypeRouter, URLRouter
# from chat.chat_consumer import ChatConsumer
# from online import consumers
# from chat.status_consumer import StatusConsumer
# from chat.blockUnblock_consumer import BlockUnblockConsumer
# from chat.friend_requests_consumer import FriendshipRequestConsumer
# from chat.SingleGame_consumer import RequestSingleGameConsumer
# from online.consumers import TournamentM_
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myChat.settings')



# isort: skip_file
import os
from django.core.asgi import get_asgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myChat.settings')
from django.urls import path,re_path
from channels.routing import ProtocolTypeRouter, URLRouter
django_asgi_app = get_asgi_application()



from chat.chat_consumer import ChatConsumer
from chat.SingleGame_consumer import RequestSingleGameConsumer
from online.consumers import TournamentM_
from chat.status_consumer import StatusConsumer
from chat.blockUnblock_consumer import BlockUnblockConsumer
from chat.friend_requests_consumer import FriendshipRequestConsumer
from online.consumer2 import GameConsumer_2
from online import consumers 
application = ProtocolTypeRouter({
  'http': get_asgi_application(),
  'websocket': URLRouter([
      re_path(r'game/host/socket-server/', consumers.GameConsumer.as_asgi()),
      #path("ws/chat/<int:receiver_id>/", ChatConsumer.as_asgi()),
      path("ws/chat/<int:receiver_id>/<str:token>", ChatConsumer.as_asgi()),
      path("ws/status/<str:token>/<int:type>", StatusConsumer.as_asgi()),
	    path('ws/block-unblock/<str:token>', BlockUnblockConsumer.as_asgi()),
	    path('ws/friend-reqs/<str:token>', FriendshipRequestConsumer.as_asgi()),
	    path('ws/single-game/<str:token>', RequestSingleGameConsumer.as_asgi()),
	    path('ws/game-tn/<str:token>/<str:room_name>', TournamentM_.as_asgi()),
	    path('ws/remote/<str:token>', consumers.GameConsumer.as_asgi()),
	    path('ws/start-single-game/<str:token>/<str:invite_id>', GameConsumer_2.as_asgi()),
  ]
    ),
})