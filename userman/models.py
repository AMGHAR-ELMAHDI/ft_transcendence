from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.contrib import admin
from .validators import max_size_validator




class PlayerManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        player = self.model(email=email, **extra_fields)
        player.set_password(password)
        player.save(using=self._db)
        return player

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class Player(AbstractBaseUser):
    
    
    STATUS_ONLINE = 'O'
    STATUS_OFFLINE = 'F'

    STATUS_CHOICES = [
        (STATUS_ONLINE, 'ONLINE'),
        (STATUS_OFFLINE, 'OFFLINE'),
    ]
    # id = models.IntegerField(unique=True, primary_key=True) 
    coins = models.IntegerField(default=0)
    status = models.CharField(
        max_length=1, choices=STATUS_CHOICES, default=STATUS_OFFLINE)
    level = models.IntegerField(default=0)
    friends = models.ManyToManyField('self', through='Friendship', symmetrical=False)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True, blank=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='store/images', validators=[max_size_validator], default='default.png')

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = PlayerManager()
    
    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser
    
    def get_friendships(self):
        friendships = Friendship.objects.filter(models.Q(player1=self) | models.Q(player2=self))
        return friendships
    


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
    class Meta:
        unique_together = ['from_user', 'to_user']


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
    title = models.CharField(max_length=56, unique = True)
    desc = models.CharField(max_length=256)
    path = models.CharField(max_length=56)

class AchievementPerUser(models.Model):
    user = models.ForeignKey(Player, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    obtaining_date = models.DateTimeField(auto_now_add=True)
    
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