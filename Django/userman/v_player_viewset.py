from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import status
from django.db.models import Q
from django.db.models import F
from .serializers import *
from .models import *
import math


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
			
			data = {
				'id' : serializer.data['id'],
				'username': serializer.data['username'],
				'email': serializer.data['email'],
				'avatar' : serializer.data['image'],
				'first_name': serializer.data['first_name'],
				'last_name': serializer.data['last_name'],
				'coins' : player.coins,
				'level': math.floor(player.level / 1000),
				'points': player.points % 1000,
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
				except Player.DoesNotExist:
					return Response({'message': 'Player Not Found!'}, status=status.HTTP_404_NOT_FOUND)
			
			played_games = GameHistory.objects.filter(Q(player=player) | Q(opponent=player))
			data = []
			for g in played_games:
				player1 = Player.objects.get(id=g.player_id)
				player2 = Player.objects.get(id=g.opponent_id)
				opponent_username = player2 if player.username == player1 else player1

				if (player == player1):
					opponent_username = player2.username
					opponent_avatar = player2.image
					player_score = g.player_score
					opponent_score= g.opponent_score
				else:
					opponent_username = player1.username
					opponent_avatar = player1.image
					player_score = g.opponent_score
					opponent_score= g.player_score

				Player.objects.get(id=g.opponent_id).image
				
				game_data = {
					'id': g.id,
					'date': g.date,
					'player_id': player.id,
					'opponent_username': opponent_username,
					'player_score':player_score,
					'opponent_score':opponent_score,
					'winner_id': g.winner_id,
					'opponent_avatar':str(opponent_avatar),
					'game_mode':g.game_mode,
					'game_duration':g.game_duration_minutes,
				}
				data.append(game_data)
			
			return Response(data, status=status.HTTP_200_OK)
		
		except Exception as e:
			return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
		
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
			return Response({'message' : 'An Error Occured !'}, status=status.HTTP_400_BAD_REQUEST)
	

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
			return Response({'message' : 'An Error Occured !'}, status=status.HTTP_400_BAD_REQUEST)
	
	
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
			return Response({'message' : 'An Error Occured !'}, status=status.HTTP_400_BAD_REQUEST)
	
	@action(detail=False, methods=['GET', 'PUT'])
	def set(self, request):
		player = self.request.user
		if request.method == 'GET':
			serializer = PlayerSet(player)
			ball_id = serializer.data['ball']
			table_id = serializer.data['table']
			paddle_id = serializer.data['paddle']
			ball = Item.objects.get(id=ball_id)
			table = Item.objects.get(id=table_id)
			paddle = Item.objects.get(id=paddle_id)
			data = {
				'email' : player.email,
				'table' : table.color,
				'paddle' : paddle.color,
				'ball' : ball.color,
				'table_id' : table.id,
				'paddle_id' : paddle.id,
				'ball_id' : ball.id,
			}
			return Response(data, status=status.HTTP_200_OK)
		

		if request.method == 'PUT':
			serialized_player = PlayerSet(player, data=request.data)
			serialized_player.is_valid(raise_exception=True)
			self.perform_update(serialized_player)
			return Response(serialized_player.data)
			# return Response("---------")

class PlayerSearchAPIView(APIView):
	permission_classes = [IsAuthenticated] 
	def get(self, request, username):
		if username:
			users = Player.objects.filter(username__icontains=username)
			serialized_players = PlayerSerializer(users, many=True)
			return Response(serialized_players.data)
		else:
			return Response({'message' : 'No username provided'}, status=status.HTTP_400_BAD_REQUEST)