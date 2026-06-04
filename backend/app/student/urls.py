from django.urls import path
from .views import StudentProfileView,TuitionListView,TuitionDetailView,ApplyTuitionView

urlpatterns = [
    path('studentprofile/', StudentProfileView.as_view(), name='student-profile'),
    path('available-tutions/', TuitionListView.as_view(), name='tution-list'),
    path('available-tutions/<int:pk>/', TuitionDetailView.as_view(), name='tution-detail'),
    path('apply-tution/', ApplyTuitionView.as_view(), name='apply-tution'),
]