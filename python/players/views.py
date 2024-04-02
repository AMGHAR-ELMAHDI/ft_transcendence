from django.db.models.aggregates import Count
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Player, FriendshipRequest
from .serializers import PlayerSerializer, FriendshipRequestSerializer, FriendshipSerializer
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
    player = get_object_or_404(Player, pk=id)
    if request.method == 'GET':
        serializer = PlayerSerializer(Player)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PlayerSerializer(Player, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    
@api_view(['GET', 'POST', 'DELETE'])
def reqs_list(request):
    if request.method == 'GET':
        queryset = FriendshipRequest.objects.all()
        serializer = FriendshipRequestSerializer(
            queryset, many=True, context={'request': request})
        return Response(serializer.data)

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Player
from .serializers import PlayerSerializer

class playerDashboard(APIView):
    def get(self, request, player_id):
        try:
            player = Player.objects.get(id=player_id)
            player_serializer = PlayerSerializer(player)

            online_friends = player.friends.filter(status=Player.STATUS_ONLINE)[:10]
            offline_friends = player.friends.filter(status=Player.STATUS_OFFLINE)[:10 - online_friends.count()]
            friends = list(online_friends) + list(offline_friends)
            friends_serializer = PlayerSerializer(friends, many=True)

            data = {
                'username': player_serializer.data['username'],
                'firstname': player_serializer.data['firstname'],
                'lastname': player_serializer.data['lastname'],
                'friends': friends_serializer.data
            }
            return Response(data)
        except Player.DoesNotExist:
            return Response({"message": "Player not found"}, status=404)
