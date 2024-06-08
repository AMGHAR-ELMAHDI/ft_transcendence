from django.urls import path
from . import views

urlpatterns = [
	path('backend/', views.FetchData),
	path('show/', views.Users),
	path('session/', views.cookies),
	path('check/', views.checkme),
	path('AutoSave/', views.SaveManual),
	path('UserLogin/', views.login),
]