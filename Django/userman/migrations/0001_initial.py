# Generated by Django 5.0.4 on 2024-04-29 00:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Achievement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=56)),
                ('path', models.CharField(max_length=56)),
                ('xp', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Friendship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('B', 'BALL'), ('P', 'PADDLE'), ('G', 'BGC'), ('A', 'AVATAR')], max_length=1)),
                ('name', models.CharField(max_length=32)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('path', models.CharField(max_length=64)),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('id', models.IntegerField(primary_key=True, serialize=False, unique=True)),
                ('coins', models.IntegerField(default=0)),
                ('status', models.CharField(choices=[('O', 'ONLINE'), ('F', 'OFFLINE')], default='F', max_length=1)),
                ('level', models.IntegerField(default=0)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('username', models.CharField(blank=True, max_length=30, unique=True)),
                ('first_name', models.CharField(blank=True, max_length=30)),
                ('last_name', models.CharField(blank=True, max_length=30)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('friends', models.ManyToManyField(through='userman.Friendship', to='userman.player')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ItemsPerUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('purchase_date', models.DateTimeField(auto_now_add=True)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='userman.item')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='userman.player')),
            ],
        ),
        migrations.CreateModel(
            name='Invites',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('P', 'PENDING'), ('A', 'ACCEPTED'), ('R', 'REJECTED')], default='P', max_length=1)),
                ('date', models.DateField(auto_now=True)),
                ('msg', models.TextField()),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_invites', to='userman.player')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_invites', to='userman.player')),
            ],
        ),
        migrations.CreateModel(
            name='GameHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('player_score', models.DecimalField(decimal_places=2, max_digits=5)),
                ('opponent_score', models.DecimalField(decimal_places=2, max_digits=5)),
                ('game_mode', models.CharField(choices=[('T', 'TOURNAMENT'), ('O', 'OPPONENT'), ('B', 'BOT')], default='O', max_length=1)),
                ('game_duration_minutes', models.DecimalField(decimal_places=2, max_digits=5)),
                ('opponent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='opponent_games', to='userman.player')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='games_as_player', to='userman.player')),
            ],
        ),
        migrations.CreateModel(
            name='FriendshipRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('P', 'Pending'), ('A', 'Accepted'), ('R', 'Rejected')], default='P', max_length=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('from_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_requests', to='userman.player')),
                ('to_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_requests', to='userman.player')),
            ],
        ),
        migrations.AddField(
            model_name='friendship',
            name='player1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friendships1', to='userman.player'),
        ),
        migrations.AddField(
            model_name='friendship',
            name='player2',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friendships2', to='userman.player'),
        ),
        migrations.CreateModel(
            name='AchievementPerUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('obtaining_date', models.DateTimeField(auto_now_add=True)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='userman.item')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='userman.player')),
            ],
        ),
    ]
