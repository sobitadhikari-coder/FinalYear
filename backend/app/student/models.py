from django.db import models

from app.authenticate.models import CustomUser

# Create your models here.
class StudentProfile(models.Model):

    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )

    interested_subjects = models.CharField(
        max_length=255,
        blank=True
    )

    def __str__(self):
        return self.user.username