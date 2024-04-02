from django.urls import path
from . import views

# URLConf
urlpatterns = [
    path('', views.players_list),
    path('<int:id>/', views.player_detail),
    path('reqs/', views.reqs_list),
    # path('dashboard/', views.playerDashboard.as_view()),
	path('dashboard/<int:player_id>/', views.playerDashboard.as_view(), name='player_dashboard'),
]
