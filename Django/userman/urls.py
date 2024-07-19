from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from .v_login_viewset import SignInAPIView, SignUpAPIView, TwoFactorSetupView, TwoFactorVerifyView
from .v_shop_viewset import AchievementViewSet, ItemViewSet
from .v_player_viewset import PlayerViewSet

router = DefaultRouter()
router.register('player', PlayerViewSet, basename = 'player')
router.register('achievements', AchievementViewSet)
router.register('items', ItemViewSet)
from .views import TokenVerifyView
urlpatterns = [
    path('', include(router.urls)), 

	path('player/<str:username>/me/', PlayerViewSet.as_view({'get': 'me'})),
	path('player/<str:username>/games/', PlayerViewSet.as_view({'get': 'games'})),
	path('player/<str:username>/achievements/', PlayerViewSet.as_view({'get': 'achievements'})),
	path('player/<str:username>/items/', PlayerViewSet.as_view({'get': 'items'})),
	
	path('user/<int:invites_id>/', getGameInvites, name='game-invites'),

	path('shop/',ShopView.as_view(), name='user-shop'),
	path('reqs/',FriendshipAPIView.as_view(), name='user-friends'),
	path('game-invites/',InvitesAPIView.as_view(), name='game-invites'),


	path('sign-in/', SignInAPIView.as_view(), name='sign_in'),
    path('sign-up/', SignUpAPIView.as_view(), name='sign_up'),
    path('setup-2fa/', TwoFactorSetupView.as_view(), name='setup_2fa'),
    path('verify-2fa/', TwoFactorVerifyView.as_view(), name='verify_2fa'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]