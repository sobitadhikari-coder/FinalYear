from auditlog.registry import auditlog
from .models import (
    TuitionApplication,
    TeacherProfile,
    Tuition,
    Class,
    Subject,
)

auditlog.register(TuitionApplication)
auditlog.register(TeacherProfile)
auditlog.register(Tuition)
auditlog.register(Class)
auditlog.register(Subject)