from django.db import models

# Create your models here.
class Player(models.Model):
    STATUS_ONLINE = 'O'
    STATUS_OFFLINE = 'F'

    STATUS_CHOICES = [
        (STATUS_ONLINE, 'ONLINE'),
        (STATUS_OFFLINE, 'OFFLINE'),
    ]
    username = models.CharField(max_length=255)
    coins = models.IntegerField(default=0)
    status = models.CharField(
        max_length=1, choices=STATUS_CHOICES, default=STATUS_OFFLINE)
    level = models.IntegerField(default=0)
    friends = models.ManyToManyField('self', through='Friendship', symmetrical=False)

    firstname = models.CharField(max_length=32)
    lastname = models.CharField(max_length=32)
    def get_friendships(self):
        friendships = Friendship.objects.filter(models.Q(player1=self) | models.Q(player2=self))
        return friendships
	
    def __str__(self) -> str:
        return self.username

    class Meta:
        ordering = ['level']

class Friendship(models.Model):
    player1 = models.ForeignKey(Player, related_name='friendships1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(Player, related_name='friendships2', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class FriendshipRequest(models.Model):
    STATUS_PENDING = 'P'
    STATUS_ACCEPTED = 'A'
    STATUS_REJECTED = 'R'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_ACCEPTED, 'Accepted'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    from_user = models.ForeignKey('Player', related_name='sent_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey('Player', related_name='received_requests', on_delete=models.CASCADE)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    

class Invites(models.Model):
    STATUS_PENDING = 'P'
    STATUS_ACCEPTED = 'A'
    STATUS_REJECTED = 'R'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'PENDING'),
        (STATUS_ACCEPTED, 'ACCEPTED'),
        (STATUS_REJECTED, 'REJECTED'),
    ]
    status = models.CharField(
        max_length=1, choices=STATUS_CHOICES, default=STATUS_PENDING)
    sender = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='sent_invites')
    receiver = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='received_invites')
    date = models.DateField(auto_now=True)
    msg = models.TextField(null=False, blank=False)
