from rest_framework import serializers
from .models import Message
from django.contrib.auth.models import User

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp']

    ## Optionally, you can include nested serializers for sender and receiver
    #sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    #receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
