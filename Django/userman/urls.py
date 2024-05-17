from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('player', views.PlayerViewSet, basename = 'player')
# router.register('friendship', views.FriendshipViewSet, basename = 'friendship')
# router.register('shop', views.ShopViewSet, basename = 'shop')
urlpatterns = [
    # path('', views.players_list),
    path('', include(router.urls)), 
	path('player/<str:username>/me/', views.PlayerViewSet.as_view({'get': 'me', 'put': 'me'})),
	path('games/<str:username>',views.PlayerSearchAPIView.as_view(), name='user-search'),
	path('shop/',views.ShopView.as_view(), name='user-shop'),
	path('friends/',views.FriendshipAPIView.as_view(), name='user-friends'),
]