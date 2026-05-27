from django.db import models

from app.authenticate.models import CustomUser

# Create your models here.
class TeacherProfile(models.Model):

    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='teacher_profile'
    )

    cv = models.FileField(upload_to='teacher_cv/')

    bio = models.TextField(blank=True)

    subjects = models.CharField(max_length=255)

    experience = models.IntegerField(default=0)

    is_verified = models.BooleanField(default=False)

    trial_start = models.DateTimeField(null=True, blank=True)

    trial_end = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.username