from .models import TeachGroup, GroupMember


def get_group_if_user_has_access(user, group_id):

    if not user or not user.is_authenticated:
        return None

    try:
        group = TeachGroup.objects.select_related(
            "tuition__teacher__user",
            "tuition__subject",
            "tuition__class_name"
        ).get(id=group_id)

    except TeachGroup.DoesNotExist:
        return None

    if user.is_superuser or user.role == "admin":
        return group

    if user.role == "teacher":
        if group.tuition.teacher.user_id == user.id:
            return group

    if user.role == "student":
        is_member = GroupMember.objects.filter(
            group=group,
            student__user=user
        ).exists()

        if is_member:
            return group

    return None


def can_access_group(user, group_id):
    return get_group_if_user_has_access(user, group_id) is not None