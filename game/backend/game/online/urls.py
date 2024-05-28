from . import views
from django.urls import path

urlpatterns = [
	path('winners/', views.GetSession)
]