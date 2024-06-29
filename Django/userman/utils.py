from .models import GameInvites

def generate_game_room_link(invite):
    # Generate a unique link for the game room
    room_id = f"room_{invite.id}"
    return f"http://yourgame.com/rooms/{room_id}"

def notify_user(user, message):
    # Implement your notification logic here
    # This could be an email, an in-app notification, etc.
    pass
