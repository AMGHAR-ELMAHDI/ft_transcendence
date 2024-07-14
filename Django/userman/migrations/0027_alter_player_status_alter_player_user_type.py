# Generated by Django 4.2.11 on 2024-07-13 13:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userman', '0026_alter_player_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='status',
            field=models.CharField(choices=[('O', 'ONLINE'), ('F', 'OFFLINE'), ('I', 'IN_GAME')], default='F', max_length=1),
        ),
        migrations.AlterField(
            model_name='player',
            name='user_type',
            field=models.CharField(choices=[('O', 'ONLINE'), ('F', 'OFFLINE'), ('I', 'IN_GAME')], default='N', max_length=1),
        ),
    ]