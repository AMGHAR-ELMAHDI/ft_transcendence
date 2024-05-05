from django.http import JsonResponse, HttpResponse
from django.views import View
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Message
import jwt
from django.shortcuts import render

from myChat import settings

def authenticate_user(request):
    authorization_header = request.headers.get('Authorization', '')
    if not authorization_header:
        return None, "No JWT token provided"
    
    try:
        token = authorization_header.split(' ')[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        user = get_object_or_404(get_user_model(), id=user_id)
        return user, None
    except IndexError:
        return None, "Invalid token format"
    except jwt.ExpiredSignatureError:
        return None, "Token expired"
    except (jwt.InvalidTokenError, KeyError):
        return None, "Invalid token"




def chat_view(request, receiver_id):
    sender, error = authenticate_user(request)
    if not sender:
        return JsonResponse({'error': error}, status=401)
    
    receiver = get_object_or_404(get_user_model(), pk=receiver_id)
    messages = Message.objects.filter(sender=sender, receiver=receiver) | Message.objects.filter(sender=receiver, receiver=sender)
    messages_with_sender_name = []
    for message in messages:
        if message.sender == sender:
            sender_name = "You"
        else:
            sender_name = message.sender.username
        messages_with_sender_name.append((sender_name, message.content))

    return render(request, 'chat/chat.html', {'messages': messages_with_sender_name, 'receiver_id': receiver_id})


def send_message(request, receiver_id):
    sender = authenticate_user(request)
    if sender:
        receiver = get_object_or_404(get_user_model(), pk=receiver_id)
        content = request.POST.get('content')
        if content:
            Message.objects.create(sender=sender, receiver=receiver, content=content)
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'error': 'Content is required'}, status=400)
    else:
        return JsonResponse({'error': 'Authentication failed'}, status=401)

class MessageListView(View):
    def get(self, request, sender_id, receiver_id):
        sender = authenticate_user(request)
        if sender:
            if sender.id != sender_id and sender.id != receiver_id:
                return JsonResponse({'error': 'You are not authorized to access these messages'}, status=403)
            messages = Message.objects.filter(
                sender_id=sender_id,
                receiver_id=receiver_id
            ).values('id', 'sender__username', 'receiver__username', 'content', 'timestamp')
            return JsonResponse(list(messages), safe=False)
        else:
            return JsonResponse({'error': 'Authentication required'}, status=401)
