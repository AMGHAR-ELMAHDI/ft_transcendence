from django.db import models

class Balls(models.Model):
    name = models.CharField(max_length=32)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    path = models.CharField(max_length=64)

class Paddles(models.Model):
    name = models.CharField(max_length=32)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    path = models.CharField(max_length=64)

class Bgcs(models.Model):
    name = models.CharField(max_length=32)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    path = models.CharField(max_length=64)

class Avatars(models.Model):
    name = models.CharField(max_length=32)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    path = models.CharField(max_length=64)
    
class Store(models.Model):
    paddles = models.ManyToManyField(Paddles)
    avatars = models.ManyToManyField(Avatars)
    balls = models.ManyToManyField(Balls)
    bgcs = models.ManyToManyField(Bgcs)

class Collection(models.Model):
    paddles = models.ManyToManyField(Paddles)
    avatars = models.ManyToManyField(Avatars)
    balls = models.ManyToManyField(Balls)
    bgcs = models.ManyToManyField(Bgcs)
