from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AchievementViewSet, ItemViewSet

router = DefaultRouter()
router.register('achievements', AchievementViewSet)
router.register('items', ItemViewSet)

urlpatterns = router.urls
