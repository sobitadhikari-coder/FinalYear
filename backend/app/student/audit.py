from auditlog.registry import auditlog
from .models import StudentProfile,StudentTuition

auditlog.register(StudentTuition)
auditlog.register(StudentProfile)
