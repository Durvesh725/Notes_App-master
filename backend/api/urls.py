from django.urls import path
from .import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name = "note-list"),
    path("notes/update/<int:pk>/", views.NoteUpdate.as_view(), name = "note-update"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name = "note-delete"),
    path("user/", views.UserDetailView.as_view(), name = "user-detail")
]