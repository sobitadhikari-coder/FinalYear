from django.urls import path
from .views import StudentProfileView,TutionListView,TutionDetailView,ApplyTuitionView

urlpatterns = [
    path('studentprofile/', StudentProfileView.as_view(), name='student-profile'),
    path('available-tutions/', TutionListView.as_view(), name='tution-list'),
    path('available-tutions/<int:pk>/', TutionDetailView.as_view(), name='tution-detail'),
    path('apply-tution/', ApplyTuitionView.as_view(), name='apply-tution'),
]