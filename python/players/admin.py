from django.contrib import admin
from .models import *


# Register your models here.
admin.site.register(Player)
admin.site.register(FriendshipRequest)
admin.site.register(Friendship)
admin.site.register(Item)
admin.site.register(ItemsPerUser)
admin.site.register(Achievement)
admin.site.register(AchievementPerUser)
admin.site.register(Message)
