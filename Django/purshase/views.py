from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from userman.serializers import AchievementSerializer, ItemSerializer
from userman.models import Achievement, Item

class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Achievement.objects.all()
	serializer_class = AchievementSerializer

	# @action(detail=False, methods=['GET'])
	# def all(self, request):
	# 	if request.method == 'GET':
	# 		achievements = Achievement.objects.all().order_by('title')
	# 		serializer = AchievementSerializer(achievements, many=True)
	# 		return Response(serializer.data, status=status.HTTP_200_OK)
	# 	return Response(serializer.data, status = status.HTTP_400_BAD_REQUEST)
		# elif request.method == 'POST':
		# 	serializer = AchievementSerializer(data=request.data)
		# 	if serializer.is_valid():
		# 		serializer.save()
		# 		return Response(serializer.data, status = status.HTTP_201_CREATED)

class ItemViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Item.objects.all()
	serializer_class = ItemSerializer

	# @action(detail=False, methods=['GET'])
	# def all(self, request):
	# 	if request.method == 'GET':
	# 		items = Item.objects.all().order_by('price')
	# 		serializer = ItemSerializer(items, many = True)
	# 		return Response(serializer.data)