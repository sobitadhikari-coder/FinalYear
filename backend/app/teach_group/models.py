# from django.db import models
# from django.core.exceptions import ValidationError

# # Create your models here.
# class TeachGroup(models.Model):
#     # group = models.ForeignKey(
#     #     TeachGroup,
#     #     on_delete=models.CASCADE,
#     #     related_name="members"
#     # )

#     student = models.ForeignKey(
#         'student.StudentProfile',
#         on_delete=models.CASCADE,
#         related_name='teach_groups'
#     )
#     teacher = models.ForeignKey(
#         'teacher.TeacherProfile',
#         on_delete=models.CASCADE,
#         related_name='teach_groups'
#     )
#     subject = models.ForeignKey(
#         'teacher.Subject',
#         on_delete=models.CASCADE,
#         related_name='teach_groups'
#     )
#     tution = models.ForeignKey(
#         'teacher.Tution',
#         on_delete=models.CASCADE,
#         related_name='teach_groups' 
#     )
#     tution_application = models.ForeignKey(
#         'teacher.TutionApplication',
#         on_delete=models.CASCADE, 
#         related_name='teach_groups'
#     )
#     enrolled_at = models.DateTimeField(auto_now_add=True)
#     def clean(self):
#         super().clean()

#         application_exists = TuitionApplication.objects.filter(
#             student=self.student,
#             tution=self.group.tution,
#             status=TuitionApplication.Status.ACCEPTED
#         ).exists()

#         if not application_exists:
#             raise ValidationError(
#                 "Only accepted students for this tuition can access this group."
#             )

#     def save(self, *args, **kwargs):
#         self.full_clean()
#         super().save(*args, **kwargs)

#     class Meta:
#         constraints = [
#             models.UniqueConstraint(
#                 fields=["group", "student"],
#                 name="unique_student_per_group"
#             )
#         ]
#     def validate_unique(self, exclude=None):
#         super().validate_unique(exclude=exclude)
#         if TeachGroup.objects.filter(student=self.student, teacher=self.teacher, subject=self.subject).exists():
#             raise models.ValidationError("This student is already enrolled with this teacher for this subject.")
#     def __str__(self):
#         return f"{self.student.user.username} - {self.teacher.user.username} - {self.subject.name}"
    