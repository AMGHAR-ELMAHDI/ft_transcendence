from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from .login_views import SignInAPIView, SignUpAPIView, TwoFactorSetupView, TwoFactorVerifyView
from .views_shop import AchievementViewSet, ItemViewSet


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
	
	path('user/<int:invites_id>/', getID),

	path('shop/',ShopView.as_view(), name='user-shop'),
	path('reqs/',FriendshipAPIView.as_view(), name='user-friends'),
	path('game-invites/',InvitesAPIView.as_view(), name='game-invites'),

	path('password/reset/confirm/<str:uid>/<str:token>', ResetPasswordAPIView.as_view()),

	path('sign-in/', SignInAPIView.as_view(), name='sign_in'),
    path('sign-up/', SignUpAPIView.as_view(), name='sign_up'),
    path('setup-2fa/', TwoFactorSetupView.as_view(), name='setup_2fa'),
    path('verify-2fa/', TwoFactorVerifyView.as_view(), name='verify_2fa'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]