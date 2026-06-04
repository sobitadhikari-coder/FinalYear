from django.urls import path
from .views import MyTuitionListView, TeacherProfileView, TeacherListView ,CreateTuitionView
# TeacherProfileUpdateView
urlpatterns = [
    path('teach-profile/', TeacherProfileView.as_view(), name='teacher-profile'),
    # path('availabilities/', AvailabilityView.as_view(), name='availability'),
    path('list/', TeacherListView.as_view(), name='teacher-list'),
    path('tution/create/', CreateTuitionView.as_view(), name='create-tuition'),
    path('tution/my/', MyTuitionListView.as_view(), name='my-tuitions'),
]