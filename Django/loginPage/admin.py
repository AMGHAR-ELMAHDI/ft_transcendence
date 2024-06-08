from django.contrib import admin
from . import models
# Register your models here.

admin.site.register(models.Player)
admin.site.register(models.Friendship)
admin.site.register(models.FriendshipRequest)
admin.site.register(models.Invites)
admin.site.register(models.Item)
admin.site.register(models.ItemsPerUser)
admin.site.register(models.Achievement)
admin.site.register(models.Message)
admin.site.register(models.GameHistory)