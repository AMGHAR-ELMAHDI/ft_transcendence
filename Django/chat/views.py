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

class UnblockAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print('---------------------')
        print(request.data)
        print('---------------------')
        blocker = request.user
        blocked_id = request.data.get('blocked')
        
        if not blocked_id:
            return Response({'error': 'Blocked user ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        blocked_user = get_object_or_404(get_user_model(), id=blocked_id)
        
        block_relationship = Block.objects.filter(blocker=blocker, blocked=blocked_user)
        
        if block_relationship.exists():
            block_relationship.delete()
            return Response({'message': 'User unblocked successfully!'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Block relationship does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    
class BlockAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        blocker = request.user
        blocked_id = request.data.get('blocked')

        if not blocked_id:
            return Response({'error': 'Blocked user ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        blocked_user = get_object_or_404(get_user_model(), id=blocked_id)

        if blocked_user == blocker:
            return Response({'error': 'You cannot block yourself mate!'}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'blocker': blocker.id,
            'blocked': blocked_user.id
        }

        serializer = BlockSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User blocked successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
        
@action(detail=False, methods=['GET', 'POST'])
class MessageAPIView(APIView):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()
    permission_classes = [IsAuthenticated]

    
    def get(self, request, receiver_id):
        sender = request.user
        if sender:
            sender_id = sender.id
            if sender.id != sender_id and sender.id != receiver_id:
                return Response({'error': 'You are not authorized to access these messages'}, status=status.HTTP_403_FORBIDDEN)
            messages = Message.objects.filter(
                 Q(sender_id=sender_id, receiver_id=receiver_id) |
                Q(sender_id=receiver_id, receiver_id=sender_id)
            )
            serialized_msg = MessageSerializer(messages, many=True)

            return Response(serialized_msg.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    def post(self, request, receiver_id):
        sender = request.user
        sender_id = sender.id
        
        if sender:
            receiver = get_object_or_404(get_user_model(), pk=receiver_id)
            content = request.data.get('content')
            if content:
                is_blocked_me = Block.objects.filter(blocker=receiver_id, blocked=sender_id).exists()
                if is_blocked_me:
                    return Response({'error': 'You cannot send messages to this user. [Blocked You]'}, status=status.HTTP_401_UNAUTHORIZED)
                is_blocked = Block.objects.filter(blocker=sender_id, blocked=receiver_id).exists()
                if is_blocked:
                    return Response({'error': 'You cannot send messages to this user. [You Blocked Him]'}, status=status.HTTP_401_UNAUTHORIZED)
                is_friend =  Friendship.objects.filter(
                 Q(player1=sender_id, player2=receiver_id) |
                Q(player1=receiver_id, player2=sender_id)
                ).exists()
                if not is_friend:
                    return Response({'error': 'You cannot send messages to this user. [Not a friend]'}, status=status.HTTP_401_UNAUTHORIZED)
                message = Message.objects.create(sender=sender, receiver=receiver, content=content)
                serialized_msg = MessageSerializer(message)
                return Response(serialized_msg.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)