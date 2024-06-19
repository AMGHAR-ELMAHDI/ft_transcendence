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

from .models import Player, Friendship
from .serializers import PlayerSerializer, ItemSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uid, token):
        try:
            # Decode the uid to get the user id
            uid = force_str(urlsafe_base64_decode(uid))
            user = Player.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Player.DoesNotExist):
            return Response({"error": "Invalid user ID."}, status=status.HTTP_400_BAD_REQUEST)

        token_generator = PasswordResetTokenGenerator()

        if token_generator.check_token(user, token):
            # Token is valid, now update the password
            new_password = request.data.get('new_password')
            if new_password:
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "New password not provided."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid token or user ID."}, status=status.HTTP_400_BAD_REQUEST)



class PlayerSearchAPIView(APIView):
    permission_classes = [IsAuthenticated] 
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


        data = {
            'all_achievements' : all_serialized_achievements.data,
            'all_items' : all_serialized_items.data,
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
        player = Player.objects.all().order_by('-points') # todo : Won games for each user to be added later
        leaderboard_serializer = LeaderBoardSerializer(player, many=True)
        return Response(leaderboard_serializer.data)
        
    @action(detail=False, methods=['GET', 'PUT'])
    def me(self, request, username=None):
        if not username:
            player = request.user
        else:
            try:
                player = Player.objects.get(username=username)
            except:
                return Response({'message' : 'Player Not Found !'}, status=status.HTTP_404_NOT_FOUND)
        if request.method == 'GET':
            serializer = PlayerSerializer(player)

            # win_rate && games
            played_games = GameHistory.objects.filter(player=player)
            total_games = played_games.count()
            wins = played_games.filter(player=player, player_score__gt=F('opponent_score')).count()
            win_rate = wins / total_games if total_games > 0 else 0
            # games_serializer = GameHistorySerializer(played_games, many=True)

            # achievements_rate && achievement per user
            total_trophies = Achievement.objects.count()
            earned_achievement = AchievementPerUser.objects.filter(user=player)
            earned_achievement_count = earned_achievement.count()
            achievements_rate = earned_achievement_count / total_trophies if total_trophies > 0 else 0
            
            #blocked_lst = player.blocked_users
            
            blocked_users = Block.objects.filter(blocker=player).select_related('blocked')
            blocked_me = Block.objects.filter(blocked=player).select_related('blocked')
            blocked_list = [
            {'id': block.blocked.id, 'username': block.blocked.username} for block in blocked_users
            ]
            
            blocked_me_list = [
                {'id': b.blocker.id, 'username' : b.blocker.username} for b in blocked_me
            ]
            print('-----------++++++++-------------')
            print(blocked_list)
            print('------------------------')
            
            data = {
                'id' : serializer.data['id'],
                'username': serializer.data['username'],
                'avatar' : serializer.data['image'],
                'first_name': serializer.data['first_name'],
                'last_name': serializer.data['last_name'],
                'coins' : player.coins,
                'level': player.level,
                'win_rate': round(win_rate, 2),
                'achievements_rate': round(achievements_rate, 2),
                'blocked_users' : blocked_list,
                'blocked_me' : blocked_me_list
            }
            return Response(data)
        elif request.method == 'PUT':
            serializer = PlayerSerializer(player, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        

    @action(detail=False, methods=['GET'])
    def games(self, request, username=None):
        try:
            if not username:
                player = request.user
            else:
                try:
                    player = Player.objects.get(username=username)
                except:
                    return Response({'message' : 'Player Not Found !'}, status=status.HTTP_404_NOT_FOUND)
            games = player.games
            data = {
                'games' : games
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message' : '--An Error Occured !'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['GET'])
    def friends(self, request):
        try:
            player = request.user
            friends = player.friend
            data = {
                'friends' : friends
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message' : 'An Error Occured !'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    @action(detail=False, methods=['GET'])
    def achievements(self, request, username=None):
        try:
            if not username:
                player = request.user
            else:
                try:
                    player = Player.objects.get(username=username)
                except:
                    return Response({'message' : 'Player Not Found !'}, status=status.HTTP_404_NOT_FOUND)
            achievements = player.achievements
            data = {
                'achievements' : achievements
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message' : 'An Error Occured !'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    @action(detail=False, methods=['GET'])
    def items(self, request, username=None):
        try:
            if not username:
                player = request.user
            else:
                try:
                    player = Player.objects.get(username=username)
                except:
                    return Response({'message' : 'Player Not Found !'}, status=status.HTTP_404_NOT_FOUND)
            items = player.items
            data = {
                'items' : items or ''
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message' : 'An Error Occured !'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@action(detail=False, methods=['GET', 'PUT', 'POST'])
class InvitesAPIView(APIView):
    queryset = Invites.objects.all()
    serializer_class = InvitesSerializer
    permission_classes = [IsAuthenticated]
    def get(self, request):
        print('---------[GET]')
        print(request.data)
        print('---------')
        user = request.user
        # sent = Invites.objects.filter(sender=user)
        recieved = Invites.objects.filter(receiver=user)
        # serialized_sent = InvitesSerializer(sent, many=True)
        serialized_recieved = InvitesSerializer(recieved, many=True)
        data = {
            # 'sent' : serialized_sent.data,
            'recieved' : serialized_recieved.data,
        }
        return Response(data, status = 200)



@action(detail=False, methods=['GET', 'PUT', 'POST'])
class FriendshipAPIView(APIView):
    queryset = FriendshipRequest.objects.all()
    serializer_class = FriendshipRequestSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print('---------[GET]')
        print(request.data)
        print('---------')
        user = request.user
        sent = FriendshipRequest.objects.filter(from_user=user)
        recieved = FriendshipRequest.objects.filter(to_user=user)
        serialized_sent = FriendshipRequestSerializer(sent, many=True)
        serialized_recieved = FriendshipRequestSerializer(recieved, many=True)
        data = {
            # 'sent' : serialized_sent.data,
            'recieved' : serialized_recieved.data,
        }
        return Response(data, status = 200)

    def post(self, request):
        to_user_id = request.data.get('to_user')
        print("------------------")
        print(request.data)
        print("------------------")
        if not to_user_id:
            return Response({'message': 'No user_id specified'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            to_user = Player.objects.get(id=to_user_id)
        except Player.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        from_user = request.user
        FriendshipRequest.objects.create(from_user=from_user, to_user=to_user)
        return Response({'message': 'Friendship request sent successfully'}, status=status.HTTP_201_CREATED)


    def put(self, request):
        user = request.user
        from_user_id = request.data.get('from_user')
        print('---------[PUT]')
        print(request.data)
        print('---------')

        if not user:
            return Response({'message': 'No user_id specified'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friendship_request = FriendshipRequest.objects.get(from_user__id=from_user_id, to_user=user)
        except FriendshipRequest.DoesNotExist:
            return Response({'message': 'Friendship request not found'}, status=status.HTTP_404_NOT_FOUND)
        new_status = request.data.get('status')
        new_status = request.data.get('status')
        if new_status not in ['P', 'A', 'R']:  #  'P' : Pending | 'A' : Accepted | 'R' : Rejected
            return Response({'message': 'Invalid status provided'}, status=status.HTTP_400_BAD_REQUEST)

        print(f'id : {friendship_request}')
        friendship_request.status = request.data.get('status')
        friendship_request.save()

        if request.data.get('status') == 'A':
            # f = Friendship(player1=from_user_id, player2=user)
            p1 = Player.objects.get(id=from_user_id)
            p2 = Player.objects.get(id=user.id)
            f = Friendship(player1=p1, player2=p2)
            f.save()

        return Response({'message': 'Friendship request updated successfully'}, status=status.HTTP_200_OK)



@action(detail=False, methods=['GET', 'PUT', 'POST'])
class FriendProfileAPIView(APIView):
    queryset = FriendshipRequest.objects.all()
    serializer_class = FriendshipRequestSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.data.get('id')
        user = Player.objects.filter(id=user_id)
        sent = FriendshipRequest.objects.filter(from_user=user)
        recieved = FriendshipRequest.objects.filter(to_user=user)
        serialized_sent = FriendshipRequestSerializer(sent, many=True)
        serialized_recieved = FriendshipRequestSerializer(recieved, many=True)
        data = {
            # 'sent' : serialized_sent.data,
            'recieved' : serialized_recieved.data,
        }
        return Response(data, status = 200)

