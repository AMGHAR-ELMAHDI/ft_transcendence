from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Player
from .serializers import *


from django.db.models.aggregates import Count
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import *
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.decorators import action
from .serializers import *
from django.db.models import F

from rest_framework.permissions import IsAuthenticatedOrReadOnly 
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Player
from .serializers import PlayerSerializer, ItemSerializer


class PlayerSearchAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly] 
    def get(self, request, username):
        if username:
            users = Player.objects.filter(username__icontains=username)
            serialized_players = PlayerSerializer(users, many=True)
            return Response(serialized_players.data)
        else:
            return Response({'message' : 'No username provided'}, status=status.HTTP_400_BAD_REQUEST)


class ShopView(APIView):
    permission_classes = [IsAuthenticated] 
    def get(self, request):
        player = request.user
        items = Item.objects.all()
        achievements = Achievement.objects.all()

        all_serialized_achievements = AchievementSerializer(achievements, many=True)
        all_serialized_items = ItemSerializer(items, many=True)

        owned_items = ItemsPerUser.objects.filter(user=player).values_list('item__id', flat=True)
        serialized_owned_items = ItemsPerUserSerializer(owned_items, many=True)

        owned_achievements = AchievementPerUser.objects.filter(user=player).values_list('item__id', flat=True)
        serialized_owned_achievements = AchievementPerUserSerializer(owned_items, many=True)

        data = {
            'all_achievements' : all_serialized_achievements.data,
            'all_items' : all_serialized_items.data,
            'owned_achievements' : serialized_owned_achievements.data,
            'owned_items' : serialized_owned_items.data,
        }
        return Response(data)
    
    def post(self, request):
        item_id = request.data.get('item_id')
        if not item_id:
            return Response({'message': 'No item_id specified'}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'message': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.coins >= item.price:
            user.coins -= item.price
            user.save()

            ItemsPerUser.objects.create(user=user, item=item)
            return Response({'message': 'Purchase successful'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Not enough coins'}, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=False, methods=['POST'])
    def purchaseItem(self, request):
        item_id = request.data.get('item_id')
        user = request.user

        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'message': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.coins >= item.price:
            user.coins -= item.price
            user.save()

            # Create ItemsPerUser object
            ItemsPerUser.objects.create(user=user, item=item)

            return Response({'message': 'Purchase successful'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Not enough coins'}, status=status.HTTP_400_BAD_REQUEST)



class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['GET', 'PUT'])
    def setting(self, request):
        player = self.request.user
        if request.method == 'GET':
            serializer = SettingsSerializer(player)
            return Response(serializer.data)
        if request.method == 'PUT':
            serialized_player = self.get_serializer(player, data=request.data)
            serialized_player.is_valid(raise_exception=True)
            self.perform_update(serialized_player)
            return Response(serialized_player.data)




    @action(detail=False, methods=['GET'])
    def leaderboard(self, request):
        player = Player.objects.all().order_by('-level')
        leaderboard_serializer = LeaderBoardSerializer(player, many=True)
        return Response(leaderboard_serializer.data)
        
    @action(detail=False, methods=['GET', 'PUT'])
    def me(self, request):
        player, created = Player.objects.get_or_create(username=request.user.username)
        if request.method == 'GET':
            serializer = PlayerSerializer(player)

            #friends
            online_friends = player.friends.filter(status=Player.STATUS_ONLINE)[:10]
            offline_friends = player.friends.filter(status=Player.STATUS_OFFLINE)[:10 - online_friends.count()]
            on_friends_serializer = PlayerSerializer(online_friends, many=True)
            off_friends_serializer = PlayerSerializer(offline_friends, many=True)

            # win_rate && games
            played_games = GameHistory.objects.filter(player=player)
            total_games = played_games.count()
            wins = played_games.filter(player=player, player_score__gt=F('opponent_score')).count()
            win_rate = wins / total_games if total_games > 0 else 0
            games_serializer = GameHistorySerializer(played_games, many=True)

            # achievements_rate && achievement per user
            total_trophies = Achievement.objects.count()
            earned_achievement = AchievementPerUser.objects.filter(user=player)
            earned_achievement_count = earned_achievement.count()
            achievements_rate = earned_achievement_count / total_trophies if total_trophies > 0 else 0
            achievements_per_user_serializer = AchievementPerUserSerializer(earned_achievement, many=True)

            # items per user
            earned_items = ItemsPerUser.objects.filter(user=player)
            item_per_user_serializer = ItemsPerUserSerializer(earned_items, many=True)

            data = {
                'avatar' : serializer.data['image'],
                'username': serializer.data['username'],
                'first_name': serializer.data['first_name'],
                'last_name': serializer.data['last_name'],
                'level': player.level,
                'win_rate': win_rate,
                'achievements_rate': achievements_rate,
                'friends': {
                    'online' : on_friends_serializer.data,
                    'offline' : off_friends_serializer.data,
                } ,
                'games': games_serializer.data,
                'achievements' : achievements_per_user_serializer.data,
                'items':item_per_user_serializer.data,
            }
            return Response(data)
        elif request.method == 'PUT':
            serializer = PlayerSerializer(player, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


class FriendshipAPIView(APIView):
    queryset = FriendshipRequest.objects.all()
    serializer_class = FriendshipRequestSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        sent = FriendshipRequest.objects.filter(from_user=user)
        recieved = FriendshipRequest.objects.filter(from_user=user)
        serialized_sent = FriendshipRequestSerializer(sent, many=True)
        serialized_recieved = FriendshipRequestSerializer(recieved, many=True)
        data = {
            'sent' : serialized_sent.data,
            'recieved' : serialized_recieved.data,
        }
        return Response(data, status = 200)

    # def post(self, request):
    #     to_user_id = request.data.get('user_id')
    #     if not to_user_id:
    #         return Response({'message': 'No user_id specified'}, status=status.HTTP_400_BAD_REQUEST)

    #     try:
    #         to_user = Player.objects.get(id=to_user_id)
    #     except Player.DoesNotExist:
    #         return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    #     from_user = request.user
    #     FriendshipRequest.objects.create(from_user=from_user, to_user=to_user)
    #     return Response({'message': 'Friendship request sent successfully'}, status=status.HTTP_201_CREATED)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(from_user=request.user)
            return Response({'message': 'Friendship request sent successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        user = request.user
        to_user_id = request.data.get('user_id')

        if not to_user_id:
            return Response({'message': 'No user_id specified'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friendship_request = FriendshipRequest.objects.get(from_user=user, to_user__id=to_user_id)
        except FriendshipRequest.DoesNotExist:
            return Response({'message': 'Friendship request not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(instance=friendship_request, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'message': 'Friendship request updated successfully'}, status=status.HTTP_200_OK)