from django.db.models.aggregates import Count
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Player
from .serializers import PlayerSerializer
# Create your views here.

@api_view(['GET', 'POST', 'DELETE'])
def players_list(request):
    #return Response('OK')
    if request.method == 'GET':
        queryset = Player.objects.all()
        serializer = PlayerSerializer(
            queryset, many=True, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PlayerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
@api_view(['GET', 'PUT', 'DELETE'])
def player_detail(request, id):
    #return Response('OK_2')
    player = get_object_or_404(Player, pk=id)
    if request.method == 'GET':
        serializer = PlayerSerializer(Player)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PlayerSerializer(Player, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)