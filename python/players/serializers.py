from .models import *
from rest_framework import serializers


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'username', 'coins', 'level', 'firstname' ,'lastname']
        
class FriendshipRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendshipRequest
        fields = ['id', 'from_user', 'to_user', 'status']

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['id', 'player1', 'player2']

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['title', 'path', 'xp']
    
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['sender', 'receiver', 'content', 'timestamp', 'is_read']

class GameHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GameHistory
        fields = ['date', 'player', 'opponent', 'player_score', 'opponent_score', 'game_mode', 'game_duration_minutes']