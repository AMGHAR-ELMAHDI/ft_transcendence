from django.urls import path
from . import views
from .views import MessageListView

urlpatterns = [
    path('chat/<int:receiver_id>/', views.chat_view, name='chat'),
    path('send-message/<int:receiver_id>/', views.send_message, name='send_message'),
    path('messages/<int:sender_id>/<int:receiver_id>/', MessageListView.as_view(), name='messages-between-users'),
]