from auditlog.registry import auditlog
from .models import GroupChatMessage

auditlog.register(GroupChatMessage)
