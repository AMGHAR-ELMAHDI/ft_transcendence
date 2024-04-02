from .models import Player, FriendshipRequest, Friendship
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
    
class playerDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        