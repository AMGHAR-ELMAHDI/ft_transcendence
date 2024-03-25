from django.db import models

# Create your models here.
class	User(models.Model):
	firstname = models.CharField(max_length=255)
	lastname = models.CharField(max_length=255)
	email = models.CharField(max_length=255, unique=True)
	password = models.CharField(max_length=255)
	coins = models.IntegerField(default=20)
	level = models.FloatField(default=0)
