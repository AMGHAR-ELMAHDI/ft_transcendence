from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Player)
admin.site.register(models.GameHistory)
admin.site.register(models.Tournament)