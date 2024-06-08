from django.db import models
from django.db.models import F
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
    email = models.CharField(max_length=255, unique=True, default='example@gmail.com')

    firstname = models.CharField(max_length=32)
    lastname = models.CharField(max_length=32)
    alias = models.CharField(max_length=255, unique=True, default='dummy')
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

class Item(models.Model):
    ITEM_BALL = 'B'
    ITEM_PADDLE = 'P'
    ITEM_BGC = 'G'
    ITEM_AVATAR = 'A'

    ITEM_CHOICES = [
        (ITEM_BALL, 'BALL'),
        (ITEM_PADDLE, 'PADDLE'),
        (ITEM_BGC, 'BGC'),
        (ITEM_AVATAR, 'AVATAR'),
    ]
    type =  models.CharField(
        max_length=1, choices=ITEM_CHOICES)
    name = models.CharField(max_length=32)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    path = models.CharField(max_length=64)

class ItemsPerUser(models.Model):
    user = models.ForeignKey(Player, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    purchase_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.item.name}"
    
class Achievement(models.Model):
    title = models.CharField(max_length=56)
    path = models.CharField(max_length=56)
    xp = models.DecimalField(max_digits=10, decimal_places=2)

class AchievementPerUser(models.Model):
    user = models.ForeignKey(Player, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    obtaining_date = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    sender = models.ForeignKey(Player, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(Player, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    def __str__(self):
        return f"From: {self.sender.username} To: {self.receiver.username} - {self.timestamp}"


class GameHistory(models.Model):
    ITEM_TOURNAMENT = 'T'
    ITEM_OPPONENT = 'O'
    ITEM_BOT = 'B'

    ITEM_CHOICES = [
        (ITEM_TOURNAMENT, 'TOURNAMENT'),
        (ITEM_OPPONENT, 'OPPONENT'),
        (ITEM_BOT, 'BOT'),
    ]
    date = models.DateTimeField(auto_now_add=True)
    player = models.ForeignKey(Player, related_name='games_as_player', on_delete=models.CASCADE)
    opponent = models.ForeignKey(Player, related_name='opponent_games', on_delete=models.CASCADE)
    player_score = models.DecimalField(max_digits=5, decimal_places=2)
    opponent_score = models.DecimalField(max_digits=5, decimal_places=2)
    game_mode = models.CharField(
        max_length=1, choices=ITEM_CHOICES, default=ITEM_OPPONENT)
    game_duration_minutes = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"Game played on {self.date} between {self.player.username} and {self.opponent.username}"