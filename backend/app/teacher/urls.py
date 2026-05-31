from django.urls import path
from .views import MyTuitionListView, TeacherProfileView, TeacherListView ,CreateTutionView
urlpatterns = [
    path('profile/', TeacherProfileView.as_view(), name='teacher-profile'),
    # path('availabilities/', AvailabilityView.as_view(), name='availability'),
    path('list/', TeacherListView.as_view(), name='teacher-list'),
    path('tution/create/', CreateTutionView.as_view(), name='create-tution'),
    path('tution/my/', MyTuitionListView.as_view(), name='my-tuitions'),
]