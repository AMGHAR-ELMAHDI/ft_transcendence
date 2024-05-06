from django.contrib import admin
from .models import Player,Friendship,Achievement, Item
# Register your models here.


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    pass

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    pass