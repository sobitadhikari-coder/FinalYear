from django.db import models

class TeachGroup(models.Model):
    tuition = models.ForeignKey(
        'teacher.Tuition', 
        on_delete=models.CASCADE,
        related_name='teach_groups'
    )
    name=models.CharField(
        max_length=100,
        unique=True
    )
    description=models.TextField(blank=True,null=True)
    video_room_name=models.CharField(
        max_length=255,
        unique=True 
    )
    created_at=models.DateTimeField(auto_now_add=True)
    is_default=models.BooleanField(default=True)
    def save(self, *args, **kwargs):
        if not self.video_room_name:
            self.video_room_name = f"tuition-{self.tuition.id}-room"
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.name} - {self.tuition.teacher.user.username}"


class GroupMember(models.Model):

    group = models.ForeignKey(
        TeachGroup,
        on_delete=models.CASCADE,
        related_name="members"
    )

    student = models.ForeignKey(
        'student.StudentProfile',
        on_delete=models.CASCADE,
        related_name="group_memberships"
    )

    added_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ("group", "student")

    def __str__(self):
        return f"{self.student.user.username} - {self.group.name}"