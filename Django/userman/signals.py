from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Player, Item, ItemsPerUser

@receiver(post_save, sender=Player)
def create_items_per_user(sender, instance, created, **kwargs):
    if created:
        default_table = Item.objects.get(type=Item.ITEM_BGC, id=1)
        default_ball = Item.objects.get(type=Item.ITEM_BALL, id=2)
        default_paddle = Item.objects.get(type=Item.ITEM_PADDLE, id=3)

        ItemsPerUser.objects.create(user=instance, item=default_table)
        ItemsPerUser.objects.create(user=instance, item=default_ball)
        ItemsPerUser.objects.create(user=instance, item=default_paddle)