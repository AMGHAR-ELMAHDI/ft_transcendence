from django.contrib import admin
from .models import Player, FriendshipRequest, Friendship


# Register your models here.
admin.site.register(Player)
admin.site.register(FriendshipRequest)
admin.site.register(Friendship)
