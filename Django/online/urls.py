from . import views
from django.urls import path

urlpatterns = [
	path('getTournaments/', views.getTournaments),
]