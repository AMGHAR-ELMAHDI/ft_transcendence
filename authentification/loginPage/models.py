from django.db import models

class MyModel(models.Model):
    input_value = models.CharField(max_length=255)
