from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

user = settings.AUTH_USER_MODEL

# Create your models here.
class Message(models.Model):
    sender = models.ForeignKey(user, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(user, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
class Block(models.Model):
    blocker = models.ForeignKey(user, related_name='blocked_users', on_delete=models.CASCADE)
    blocked = models.ForeignKey(user, related_name='blockers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['blocker', 'blocked']
