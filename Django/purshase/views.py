from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from userman.serializers import AchievementSerializer, ItemSerializer
from userman.models import Achievement, Item

class AchievementViewSet(viewsets.ModelViewSet):
	queryset = Achievement.objects.all()
	serializer_class = AchievementSerializer

	@action(detail=False, methods=['GET', 'POST', 'PUT'])
	def all(self, request):
		if request.method == 'GET':
			achievements = Achievement.objects.all().order_by('title')
			serializer = AchievementSerializer(achievements, many=True)
			return Response(serializer.data)
		elif request.method == 'POST':
			serializer = AchievementSerializer(data=request.data)
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data, status = 201)
			return Response(serializer.data, status = 400)

class ItemViewSet(viewsets.ModelViewSet):
	queryset = Item.objects.all()
	serializer_class = ItemSerializer

	@action(detail=False, methods=['GET', 'POST', 'PUT'])
	def all(self, request):
		if request.method == 'GET':
			items = Item.objects.all().order_by('price')
			serializer = ItemSerializer(items, many = True)
			return Response(serializer.data)