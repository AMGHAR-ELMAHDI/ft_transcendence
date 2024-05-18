from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('player', PlayerViewSet, basename = 'player')
urlpatterns = [
    path('', include(router.urls)), 

	path('player/<str:username>/me/', PlayerViewSet.as_view({'get': 'me'})),
	path('player/<str:username>/games/', PlayerViewSet.as_view({'get': 'games'})),
	path('player/<str:username>/achievements/', PlayerViewSet.as_view({'get': 'achievements'})),
	path('player/<str:username>/items/', PlayerViewSet.as_view({'get': 'items'})),
	
	

	path('shop/',ShopView.as_view(), name='user-shop'),
	path('reqs/',FriendshipAPIView.as_view(), name='user-friends'),
]