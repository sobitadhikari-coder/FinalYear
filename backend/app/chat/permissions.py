from app.teach_group.models import TeachGroup, GroupMember


def can_access_group_chat(user, group_id):

    if not user or not user.is_authenticated:
        return False

    try:
        group = TeachGroup.objects.select_related(
            'tuition__teacher__user'
        ).get(id=group_id)

    except TeachGroup.DoesNotExist:
        return False

    # Teacher owner check
    if user.role == 'teacher':
        return group.tuition.teacher.user_id == user.id

    # Student member check
    if user.role == 'student':
        return GroupMember.objects.filter(
            group=group,
            student__user=user
        ).exists()

    # Admin optional
    if user.role == 'admin':
        return True

    return False