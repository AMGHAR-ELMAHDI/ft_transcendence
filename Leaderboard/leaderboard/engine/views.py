from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.core.serializers import serialize
from .models import Player
import json
# Create your views here.

def leaderboard(request):
	queryset = Player.objects.order_by('-level')
	data = serialize('json', queryset)
	print(data)
	return JsonResponse(data, safe=False)