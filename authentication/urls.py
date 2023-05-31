from django.urls import path
from .views import capture_image, attendance, train_model, add_new, current_user, UserList , save_event, search

urlpatterns = [
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    path('capture_image/', capture_image),
    path('attendance_record/',attendance),
    path('add_new/', add_new),
    path('train_model/',train_model),
    path('save_event/',save_event),
    path('search/',search),
]