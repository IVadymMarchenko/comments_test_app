from django.apps import AppConfig


class AppCommentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app_comments'
    
    def ready(self):
        import app_comments.signals  # noqa
