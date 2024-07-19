from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated



from userman.serializers import AchievementSerializer, ItemSerializer
from userman.models import Achievement, Item

class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Achievement.objects.all()
	serializer_class = AchievementSerializer
	permission_classes = [IsAuthenticated]

class ItemViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Item.objects.all()
	serializer_class = ItemSerializer
	permission_classes = [IsAuthenticated]
