from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django import forms

admin.site.use_tz = True

User = get_user_model()


ROLE_GROUP_MAP = {
    "admin": "Admin",
    "teacher": "Teacher",
    "student": "Student",
}


class CustomUserCreationForm(forms.ModelForm):

    ROLE_CHOICES = (
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
        ('student', 'Student'),
    )

    role = forms.ChoiceField(
        choices=ROLE_CHOICES
    )

    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput
    )

    password2 = forms.CharField(
        label="Confirm Password",
        widget=forms.PasswordInput
    )

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'phone_number',
            'profile_image',
            'role',
        )
        filter_vertical = ("permissions",)


    def clean(self):

        cleaned_data = super().clean()

        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 != password2:
            raise forms.ValidationError(
                "Passwords do not match"
            )

        return cleaned_data

    def save(self, commit=True):

        user = super().save(commit=False)

        user.set_password(
            self.cleaned_data["password1"]
        )

        user.role = self.cleaned_data.get(
            "role",
            "student"
        )

        # sync permission flags
        user.is_staff = user.role in [
            "teacher",
            "admin"
        ]

        user.is_superuser = user.role == "admin"

        if commit:
            user.save()

        return user


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    add_form = CustomUserCreationForm

    list_display = (
        'id',
        'username',
        'email',
        'phone_number',
        'role_display',
        'is_staff',
        'is_active',
    )

    list_filter = (
        'role',
        'is_staff',
        'is_active',
        'is_superuser',
    )
    
    search_fields = (
        'username',
        'email',
        'phone_number',
    )

    ordering = (
        '-id',
    )

    readonly_fields = (
        'last_login',
        'date_joined',
    )

    fieldsets = (
        (
            None,
            {
                'fields': (
                    'username',
                    'password',
                )
            }
        ),

        (
            'Personal Info',
            {
                'fields': (
                    'first_name',
                    'last_name',
                    'email',
                    'phone_number',
                    'profile_image',
                    'role',
                )
            }
        ),

        (
            'Permissions',
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    # 'user_permissions',
                )
            }
        ),

        (
            'Important Dates',
            {
                'fields': (
                    'last_login',
                    'date_joined',
                )
            }
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),

                'fields': (
                    'username',
                    'email',
                    'phone_number',
                    'profile_image',
                    'role',
                    'password1',
                    'password2',
                ),
            },
        ),
    )

    def role_display(self, obj):

        if obj.groups.exists():
            return obj.groups.first().name

        return "No Role"

    role_display.short_description = "Role"

    def save_model(self, request, obj, form, change):

        obj.role = form.cleaned_data.get(
            "role",
            "student"
        )

        # sync permission flags BEFORE save
        obj.is_staff = obj.role in [
            "teacher",
            "admin"
        ]

        obj.is_superuser = obj.role == "admin"

        super().save_model(
            request,
            obj,
            form,
            change
        )

        # sync groups
        obj.groups.clear()

        group_name = ROLE_GROUP_MAP.get(
            obj.role,
            "Student"
        )

        group, _ = Group.objects.get_or_create(
            name=group_name
        )

        obj.groups.add(group)