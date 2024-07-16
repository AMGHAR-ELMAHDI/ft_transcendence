from django.contrib import admin
from .models import *
# Register your models here.


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    pass
@admin.register(ItemsPerUser)
class ItemsPerUserAdmin(admin.ModelAdmin):
    pass
@admin.register(GameHistory)
class GameHistoryAdmin(admin.ModelAdmin):
    pass
@admin.register(Tournament)
class Tournament(admin.ModelAdmin):
    pass
# @admin.register(GameHistory)
# class AchievementAdmin(admin.ModelAdmin):
#     pass
@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    pass
@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    pass

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    pass
@admin.register(AchievementPerUser)
class AchievementPerUserAdmin(admin.ModelAdmin):
    pass