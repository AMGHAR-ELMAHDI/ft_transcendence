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

class Item(models.Model):
    ITEM_BALL = 'B'
    ITEM_PADDLE = 'P'
    ITEM_BGC = 'G'
    ITEM_AVATAR = 'A'

    ITEM_CHOICES = [
        (ITEM_BALL, 'PENDING'),
        (ITEM_PADDLE, 'ACCEPTED'),
        (ITEM_BGC, 'REJECTED'),
        (ITEM_AVATAR, 'REJECTED'),
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
