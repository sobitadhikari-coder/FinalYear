from django.db import models
from django.conf import settings

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
    
class StudentTuition(models.Model):
    student = models.ForeignKey(
        'StudentProfile',
        on_delete=models.CASCADE,
        related_name='enrollments'
    )

    tuition = models.ForeignKey(
        'teacher.Tuition',
        on_delete=models.CASCADE,
        related_name='enrollments'
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'tuition')

    def __str__(self):
        return f"{self.student.user.username} enrolled in {self.tuition.subject} - {self.tuition.class_name}"
    

