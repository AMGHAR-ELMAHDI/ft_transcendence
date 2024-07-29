from django.http import JsonResponse, HttpResponse
from django.views import View
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Message, Block
import jwt
from django.shortcuts import render
from rest_framework.decorators import action
from myChat import settings
from .serializers import MessageSerializer, BlockSerializer
from .models import Message, Block
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.decorators import APIView

from userman.models import Friendship
from userman.utils import getLogging
logger = getLogging()

class UnblockAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        blocker = request.user
        blocked_id = request.data.get('blocked')
        
        if not blocked_id:
            return Response({'error': 'Blocked user ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            blocked_user = get_object_or_404(get_user_model(), id=blocked_id)
        except Exception as e:
            logger.error(f"Error retrieving blocked user: {e}")
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        block_relationship = Block.objects.filter(blocker=blocker, blocked=blocked_user)
        
        if block_relationship.exists():
            block_relationship.delete()
            logger.info(f"User {blocker.username} unblocked {blocked_user.username}")
            return Response({'message': 'User unblocked successfully!'}, status=status.HTTP_200_OK)
        else:
            logger.warning(f"Block relationship does not exist for blocker: {blocker.username} and blocked: {blocked_user.username}")
            return Response({'error': 'Block relationship does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    
class BlockAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        blocker = request.user
        blocked_id = request.data.get('blocked')

        if not blocked_id:
            return Response({'error': 'Blocked user ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blocked_user = get_object_or_404(get_user_model(), id=blocked_id)
        except Exception as e:
            logger.error(f"Error retrieving blocked user: {e}")
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if blocked_user == blocker:
            logger.warning(f"User {blocker.username} attempted to block themselves")
            return Response({'error': 'You cannot block yourself!'}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'blocker': blocker.id,
            'blocked': blocked_user.id
        }

        serializer = BlockSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"User {blocker.username} blocked {blocked_user.username}")
            return Response({'message': 'User blocked successfully!'}, status=status.HTTP_201_CREATED)
        
        logger.warning(f"Validation failed for blocking user: {blocker.username}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
        

class MessageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, receiver_id):
        sender = request.user
        sender_id = sender.id

        if sender_id == receiver_id:
            return Response({'error': 'You cannot retrieve messages for yourself'}, status=status.HTTP_403_FORBIDDEN)

        messages = Message.objects.filter(
            Q(sender_id=sender_id, receiver_id=receiver_id) |
            Q(sender_id=receiver_id, receiver_id=sender_id)
        )
        serialized_msg = MessageSerializer(messages, many=True)
        return Response(serialized_msg.data, status=status.HTTP_200_OK)

    def post(self, request, receiver_id):
        sender = request.user
        sender_id = sender.id
        receiver = get_object_or_404(get_user_model(), pk=receiver_id)

        if receiver_id == sender_id:
            return Response({'error': 'You cannot send messages to yourself'}, status=status.HTTP_403_FORBIDDEN)

        if not request.data.get('content'):
            return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check block statuses
        if Block.objects.filter(blocker=receiver_id, blocked=sender_id).exists():
            return Response({'error': 'You cannot send messages to this user. [Blocked You]'}, status=status.HTTP_403_FORBIDDEN)
        if Block.objects.filter(blocker=sender_id, blocked=receiver_id).exists():
            return Response({'error': 'You cannot send messages to this user. [You Blocked Them]'}, status=status.HTTP_403_FORBIDDEN)

        # Check if users are friends
        if not Friendship.objects.filter(
                Q(player1=sender_id, player2=receiver_id) |
                Q(player1=receiver_id, player2=sender_id)
        ).exists():
            return Response({'error': 'You cannot send messages to this user. [Not a friend]'}, status=status.HTTP_403_FORBIDDEN)

        content = request.data['content']
        message = Message.objects.create(sender=sender, receiver=receiver, content=content)
        serialized_msg = MessageSerializer(message)
        return Response(serialized_msg.data, status=status.HTTP_201_CREATED)