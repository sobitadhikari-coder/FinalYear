from django.db import models
from django.conf import settings
from app.authenticate.models import CustomUser
from app.teacher.models import Tution

# Create your models here.
class StudentProfile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    grade = models.CharField(
        max_length=50,
        blank=True
    )

    interested_subjects = models.CharField(
        max_length=255,
        blank=True
    )

    def __str__(self):
        return self.user.username
    
class StudentTution(models.Model):
    student = models.ForeignKey(
        'student.StudentProfile',
        on_delete=models.CASCADE,
        related_name='enrollments'
    )

    tution = models.ForeignKey(
        'teacher.Tution',
        on_delete=models.CASCADE,
        related_name='enrollments'
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'tution')

    def __str__(self):
        return f"{self.student.user.username} enrolled in {self.tution.subject} - {self.tution.class_name}"
    
    