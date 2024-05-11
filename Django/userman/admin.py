from django.contrib import admin
from .models import *
# Register your models here.


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    pass
@admin.register(ItemsPerUser)
class AchievementAdmin(admin.ModelAdmin):
    pass
@admin.register(GameHistory)
class AchievementAdmin(admin.ModelAdmin):
    pass
# @admin.register(GameHistory)
# class AchievementAdmin(admin.ModelAdmin):
#     pass
@admin.register(Player)
class AchievementAdmin(admin.ModelAdmin):
    pass
@admin.register(Friendship)
class AchievementAdmin(admin.ModelAdmin):
    pass

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    pass