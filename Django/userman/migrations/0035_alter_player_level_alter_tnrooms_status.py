# Generated by Django 4.2.11 on 2024-07-19 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userman', '0034_alter_item_color'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='level',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='tnrooms',
            name='status',
            field=models.CharField(choices=[('Q', 'QUEUE'), ('S', 'STARTED'), ('E', 'ENDED')], default='Q', max_length=255),
        ),
    ]
