from . import views
from django.urls import path

urlpatterns = [
	path('save-game/', views.StockGame),
]