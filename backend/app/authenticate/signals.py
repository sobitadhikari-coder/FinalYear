from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group

from .models import CustomUser, ROLE_GROUP_MAP


@receiver(post_save, sender=CustomUser)
def sync_user_group(sender, instance, created, **kwargs):

    group_name = ROLE_GROUP_MAP.get(instance.role)

    if group_name:

        group, _ = Group.objects.get_or_create(
            name=group_name
        )

        instance.groups.set([group])