from django.http import JsonResponse, HttpResponse
from django.views import View
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Message
import jwt
from django.shortcuts import render
from rest_framework.decorators import action
from myChat import settings
from .serializers import MessageSerializer
from .models import Message
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.decorators import api_view, APIView


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
        if sender:
            receiver = get_object_or_404(get_user_model(), pk=receiver_id)
            content = request.data.get('content')
            if content:
                message = Message.objects.create(sender=sender, receiver=receiver, content=content)
                serialized_msg = MessageSerializer(message)
                return Response(serialized_msg.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)