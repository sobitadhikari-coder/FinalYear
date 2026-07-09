from auditlog.registry import auditlog
from .models import TeachGroup,GroupMeeting,GroupMember

auditlog.register(TeachGroup)
auditlog.register(GroupMeeting)
auditlog.register(GroupMember)

