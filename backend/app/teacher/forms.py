from django import forms
from .models import TeacherProfile, Subject,Class


class TeacherProfileForm(forms.ModelForm):

    new_subject = forms.CharField(
        max_length=100,
        required=False
    )

    class Meta:
        model = TeacherProfile
        fields = ["bio", "experience", "cv", "subjects", "class_name"]

        widgets = {
            "subjects": forms.CheckboxSelectMultiple(),
            "class_name": forms.CheckboxSelectMultiple(),
        }