from django.apps import AppConfig


class UsermanConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'userman'
    def ready(self):
        import userman.signals