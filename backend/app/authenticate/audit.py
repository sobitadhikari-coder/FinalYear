from auditlog.registry import auditlog
from .models import CustomUser

auditlog.register(CustomUser)
