# Generated by Django 4.2.11 on 2024-07-05 16:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userman', '0018_player_points'),
    ]

    operations = [
        migrations.AlterField(
            model_name='achievement',
            name='path',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='achievement',
            name='title',
            field=models.CharField(max_length=256, unique=True),
        ),
    ]
