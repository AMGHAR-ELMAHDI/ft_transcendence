from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('player', PlayerViewSet, basename = 'player')
urlpatterns = [
    path('', include(router.urls)), 

	path('player/<int:id>/me/', PlayerViewSet.as_view({'get': 'me'})),
	path('player/<int:id>/games/', PlayerViewSet.as_view({'get': 'games'})),
	path('player/<int:id>/achievements/', PlayerViewSet.as_view({'get': 'achievements'})),
	path('player/<int:id>/items/', PlayerViewSet.as_view({'get': 'items'})),
	
	

	path('shop/',ShopView.as_view(), name='user-shop'),
	path('reqs/',FriendshipAPIView.as_view(), name='user-friends'),
]