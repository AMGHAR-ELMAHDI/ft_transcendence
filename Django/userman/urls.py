from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from .login_views import SignInAPIView, SignUpAPIView

router = DefaultRouter()
router.register('player', PlayerViewSet, basename = 'player')
# router.register('auth', AuthViewSet, basename = 'auth')
urlpatterns = [
    path('', include(router.urls)), 

	path('player/<str:username>/me/', PlayerViewSet.as_view({'get': 'me'})),
	path('player/<str:username>/games/', PlayerViewSet.as_view({'get': 'games'})),
	path('player/<str:username>/achievements/', PlayerViewSet.as_view({'get': 'achievements'})),
	path('player/<str:username>/items/', PlayerViewSet.as_view({'get': 'items'})),
	
	

	path('shop/',ShopView.as_view(), name='user-shop'),
	path('reqs/',FriendshipAPIView.as_view(), name='user-friends'),
	path('game-invites/',InvitesAPIView.as_view(), name='game-invites'),

	path('password/reset/confirm/<str:uid>/<str:token>', ResetPasswordAPIView.as_view()),

	path('sign-in/',SignInAPIView.as_view(), name='sign-in'),
	path('sign-up/',SignUpAPIView.as_view(), name='sign-up'),


]