from django.apps import AppConfig

class TeachGroupConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app.teach_group'

    def ready(self):
        import app.teach_group.signals
        import app.teach_group.audit