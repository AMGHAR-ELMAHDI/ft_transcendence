from django.urls import path
from . import views

# URLConf
urlpatterns = [
    path('', views.players_list),
    path('<int:id>/', views.player_detail),
]
