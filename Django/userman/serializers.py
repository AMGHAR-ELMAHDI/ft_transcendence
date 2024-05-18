from rest_framework import serializers
from .models import *

from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model

# User = get_user_model()

from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import Player  # Import your Player model here

from rest_framework import serializers
from .models import Player  # Import your Player model here

class PlayerCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    # Override the create method to exclude id field
    def create(self, validated_data):
        validated_data.pop('id', None)  # Exclude 'id' field if present
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = Player
        fields = ['id', 'email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}
                        }



# class PlayerCreateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Player
#         fields = ['email','username', 'password']
    
class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'email', 'first_name', 'last_name', 'username', 'coins', 'level', 'image']
        extra_kwargs = {'level': {'read_only': True},
                        'coins': {'read_only': True},
                        }
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
        fields = ['id','title', 'desc', 'path']
        
class GameHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GameHistory
        fields = ['date', 'player', 'opponent', 'player_score', 'opponent_score', 'game_mode', 'game_duration_minutes']
    
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'type', 'name', 'price', 'path']

class PlayerSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['username']

class LeaderBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['username', 'first_name', 'last_name', 'image', 'level', 'coins', 'won_matches']
    def get_won_matches(self, player):
        return player.get_won_games_count

class SettingsSerializer (serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['email', 'username', 'first_name', 'last_name', 'image']

        # extra_kwargs = {
        #     'email' : {'read_only' : True},
        #     'username' : {'read_only' : True},
        # }
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class FriendshipPlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'image']