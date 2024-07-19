# Generated by Django 4.2.11 on 2024-07-18 16:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('userman', '0032_item_color'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='ball',
            field=models.ForeignKey(default='2', on_delete=django.db.models.deletion.CASCADE, related_name='ball', to='userman.item'),
        ),
        migrations.AlterField(
            model_name='player',
            name='paddle',
            field=models.ForeignKey(default='3', on_delete=django.db.models.deletion.CASCADE, related_name='paddle', to='userman.item'),
        ),
    ]