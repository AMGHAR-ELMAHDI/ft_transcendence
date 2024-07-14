from rest_framework import serializers
from .models import *
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
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
        fields = ['username', 'first_name', 'last_name', 'image', 'level', 'coins', 'won_matches', 'points']
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
        
class InvitesSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()

    class Meta:
        model = Invites
        fields = ['id', 'sender', 'sender_username', 'receiver', 'status', 'room_id', 'date']
    
    def get_sender_username(self, obj):
        return obj.sender.username
    


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=Player.objects.all(), message="This email is already in use.")]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=Player.objects.all(), message="This username is already in use.")]
    )

    class Meta:
        model = Player
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Password fields didn't match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = Player.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = Player
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = Player(
            email=validated_data['email'],
            username=validated_data['username'],
            # first_name=validated_data['first_name'],
            # last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user