# Generated by Django 4.2.13 on 2024-05-25 12:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('online', '0002_achievement_achievementperuser_friendship_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='alias',
            field=models.CharField(default='dummy', max_length=255, unique=True),
        ),
    ]
