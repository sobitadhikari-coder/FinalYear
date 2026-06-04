# from django.db.models.signals import post_save
# from django.dispatch import receiver

# from app.teacher.models import Tuition
# from .models import TeachGroup


# @receiver(post_save, sender=Tuition)
# def create_default_teach_group(sender, instance, created, **kwargs):

#     if created:
#         TeachGroup.objects.get_or_create(
#             tuition=instance,
#             defaults={
#                 "name": f"{instance.class_name.name} {instance.subject.name} Group",
#                 "description": f"Default group for {instance.subject.name}",
#             }
#         )