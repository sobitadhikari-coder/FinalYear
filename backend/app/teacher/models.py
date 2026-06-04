from django.db import models
from django.conf import settings
class Class(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    def __str__(self):
        return self.name
    
class Subject(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    def __str__(self):
        return self.name

class TeacherProfile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teacher_profile'
    )
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    subjects = models.ManyToManyField(
        Subject,
        related_name='teachers'

    )

    bio = models.TextField(blank=True)

    experience = models.PositiveIntegerField(
        default=0
    )

    cv = models.FileField(
        upload_to='teacher_cv/'
    )

    is_verified = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )
    
    def __str__(self):
        return self.user.username

class Tuition(models.Model):

    teacher = models.ForeignKey(
        TeacherProfile,
        on_delete=models.CASCADE,
        related_name='tutions'
    )

    # student = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     on_delete=models.CASCADE,
    #     related_name='tutions'
    # )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='tutions'
    )

    class_name = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name='tutions'
    )
    price_per_month = models.IntegerField(
        default=0
    )
    hours=models.IntegerField(
        default=0
    )

    def __str__(self):
        return f"{self.teacher.user.username} - {self.subject.name}"

class Availability(models.Model):

    teacher = models.ForeignKey(
        TeacherProfile,
        on_delete=models.CASCADE,
        related_name='availabilities'
    )

    day = models.CharField(max_length=20)

    start_time = models.TimeField()

    end_time = models.TimeField()

    def __str__(self):
        return f"{self.teacher.user.username} - {self.day}"
    
class TuitionApplication(models.Model):
    class textChoices(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'
        COMPLETED = 'completed', 'Completed'

    student = models.ForeignKey(
        'student.StudentProfile',
        on_delete=models.CASCADE,
        related_name="applications"
    )

    tuition = models.ForeignKey(
        Tuition,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    message = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=textChoices.choices,
        default=textChoices.PENDING
    )

    applied_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ("student", "tuition")