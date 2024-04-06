from django.db.models.aggregates import Count
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Player, FriendshipRequest
from .serializers import *

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



class PlayerDashboard(APIView):
    def get(self, request, player_id):
        try:
            player = Player.objects.get(id=player_id)
            player_serializer = PlayerSerializer(player)

            online_friends = player.friends.filter(status=Player.STATUS_ONLINE)[:10]
            offline_friends = player.friends.filter(status=Player.STATUS_OFFLINE)[:10 - online_friends.count()]
            played_games = GameHistory.objects.filter(player=player)

            # win_rate
            total_games = played_games.count()
            wins = played_games.filter(player=player, player_score__gt=F('opponent_score')).count()
            win_rate = wins / total_games if total_games > 0 else 0

            #trophies_rate
            total_trophies = Achievement.objects.count()
            earned_trophies = AchievementPerUser.objects.filter(user=player).count()
            trophies_rate = earned_trophies / total_games if total_trophies > 0 else 0
            # Serialize data
            friends_serializer = PlayerSerializer(online_friends.union(offline_friends), many=True)
            games_serializer = GameHistorySerializer(played_games, many=True)

            data = {
                'username': player_serializer.data['username'],
                'firstname': player_serializer.data['firstname'],
                'lastname': player_serializer.data['lastname'],
                'level' : player.level,
                'win_rate' : win_rate,
                'trophies_rate' : trophies_rate,
                'friends': friends_serializer.data,
                'games': games_serializer.data,
            }
            return Response(data)
        except Player.DoesNotExist:
            return Response({"message": "Player not found"}, status=404)

