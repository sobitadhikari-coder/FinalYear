from django.contrib.auth.models import AbstractUser, BaseUserManager, Group
from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone

ROLE_GROUP_MAP = {
    "admin": "Admin",
    "teacher": "Teacher",
    "student": "Student",
}

class CustomUserManager(BaseUserManager):

    def create_user(self, username, email=None, password=None, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "admin")  # ensure role is admin

        user = self.create_user(username, email, password, **extra_fields)
        return user

class CustomUser(AbstractUser):

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    phone_validator = RegexValidator(
        regex=r'^\d{10}$',
        message='Phone number must be exactly 10 digits.'
    )

    phone_number = models.CharField(
        max_length=10,
        validators=[phone_validator],
        unique=True,
        null=True,
        blank=True
    )

    full_name = models.CharField(max_length=75, blank=True)
    bio = models.CharField(max_length=500, blank=True)

    profile_image = models.ImageField(
        upload_to='profile_images/',
        blank=True,
        null=True
    )

    objects = CustomUserManager()

    def save(self, *args, **kwargs):

        super().save(*args, **kwargs)

        self.groups.clear()

        group_name = ROLE_GROUP_MAP.get(self.role)

        if group_name:
            group, _ = Group.objects.get_or_create(name=group_name)
            self.groups.add(group)
    


    


#  OTP 
class PasswordResetOtp(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.expires_at
 #hjgadsjgvdj
    class Meta:
        ordering = ['-created_at']
        indexes= [
            models.Index(fields=['user', 'otp']),
        ]
