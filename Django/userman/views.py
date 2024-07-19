from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import *
from .models import *
import jwt


User = get_user_model()

class ShopView(APIView):
	permission_classes = [IsAuthenticated] 
	def get(self, request):
		player = request.user
		items = Item.objects.all()
		achievements = Achievement.objects.all()

		all_serialized_achievements = AchievementSerializer(achievements, many=True)
		all_serialized_items = ItemSerializer(items, many=True)


		data = {
			'all_achievements' : all_serialized_achievements.data,
			'all_items' : all_serialized_items.data,
		}
		return Response(data, status=status.HTTP_200_OK)
	
	def post(self, request):
		item_id = request.data.get('item_id')
		if not item_id:
			return Response({'message': 'No item_id specified'}, status=status.HTTP_400_BAD_REQUEST)
		user = request.user
		
		try:
			item = Item.objects.get(id=item_id)
		except Item.DoesNotExist:
			return Response({'message': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

		if  ItemsPerUser.objects.filter(user=user, item=item).exists():
			return Response({'message': 'Item already owned'}, status=status.HTTP_403_FORBIDDEN)
		
		if user.coins >= item.price:
			user.coins -= item.price
			user.save()

			ItemsPerUser.objects.create(user=user, item=item)
			return Response({'message': 'Purchase successful'}, status=status.HTTP_201_CREATED)
		else:
			return Response({'message': 'Not enough coins'}, status=status.HTTP_403_FORBIDDEN)
	

	@action(detail=False, methods=['POST'])
	def purchaseItem(self, request):
		item_id = request.data.get('item_id')
		user = request.user

		try:
			item = Item.objects.get(id=item_id)
		except Item.DoesNotExist:
			return Response({'message': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

		if user.coins >= item.price:
			user.coins -= item.price
			user.save()

			# Create ItemsPerUser object
			ItemsPerUser.objects.create(user=user, item=item)

			return Response({'message': 'Purchase successful'}, status=status.HTTP_201_CREATED)
		else:
			return Response({'message': 'Not enough coins'}, status=status.HTTP_400_BAD_REQUEST)






@action(detail=False, methods=['GET', 'PUT', 'POST'])
class InvitesAPIView(APIView):
	queryset = Invites.objects.all()
	serializer_class = InvitesSerializer
	permission_classes = [IsAuthenticated]
	def get(self, request):
		user = request.user
		pending = Invites.objects.filter(receiver=user, status = 'P')
		accepted = Invites.objects.filter(receiver=user, status = 'A')
		sent = Invites.objects.filter(sender=user, status = 'A')
		serialized_pending = InvitesSerializer(pending, many=True)
		serialized_accepted = InvitesSerializer(accepted, many=True)
		serialized_sent = InvitesSerializer(sent, many=True)
		data = {
			# 'sent' : serialized_sent.data,
			'pending' : serialized_pending.data,
			'accepted' : serialized_accepted.data,
			'sent' : serialized_sent.data
		}
		return Response(data, status = status.HTTP_200_OK)



@action(detail=False, methods=['GET', 'PUT', 'POST'])
class FriendshipAPIView(APIView):
	queryset = FriendshipRequest.objects.all()
	serializer_class = FriendshipRequestSerializer
	permission_classes = [IsAuthenticated]

	def get(self, request):
		user = request.user
		sent = FriendshipRequest.objects.filter(from_user=user)
		recieved = FriendshipRequest.objects.filter(to_user=user)
		serialized_sent = FriendshipRequestSerializer(sent, many=True)
		serialized_recieved = FriendshipRequestSerializer(recieved, many=True)
		data = {
			# 'sent' : serialized_sent.data,
			'recieved' : serialized_recieved.data,
		}
		return Response(data, status = status.HTTP_200_OK)

	def post(self, request):
		to_user_id = request.data.get('to_user')
		if not to_user_id:
			return Response({'message': 'No user_id specified'}, status=status.HTTP_400_BAD_REQUEST)

		try:
			to_user = Player.objects.get(id=to_user_id)
		except Player.DoesNotExist:
			return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

		from_user = request.user
		FriendshipRequest.objects.create(from_user=from_user, to_user=to_user)
		return Response({'message': 'Friendship request sent successfully'}, status=status.HTTP_201_CREATED)


	def put(self, request):
		user = request.user
		from_user_id = request.data.get('from_user')

		if not user:
			return Response({'message': 'No user_id specified'}, status=status.HTTP_400_BAD_REQUEST)

		try:
			friendship_request = FriendshipRequest.objects.get(from_user__id=from_user_id, to_user=user)
		except FriendshipRequest.DoesNotExist:
			return Response({'message': 'Friendship request not found'}, status=status.HTTP_404_NOT_FOUND)
		new_status = request.data.get('status')
		new_status = request.data.get('status')
		if new_status not in ['P', 'A', 'R']:  #  'P' : Pending | 'A' : Accepted | 'R' : Rejected
			return Response({'message': 'Invalid status provided'}, status=status.HTTP_400_BAD_REQUEST)

		friendship_request.status = request.data.get('status')
		friendship_request.save()

		if request.data.get('status') == 'A':
			# f = Friendship(player1=from_user_id, player2=user)
			p1 = Player.objects.get(id=from_user_id)
			p2 = Player.objects.get(id=user.id)
			f = Friendship(player1=p1, player2=p2)
			f.save()

		return Response({'message': 'Friendship request updated successfully'}, status=status.HTTP_200_OK)



@action(detail=False, methods=['GET', 'PUT', 'POST'])
class FriendProfileAPIView(APIView):
	queryset = FriendshipRequest.objects.all()
	serializer_class = FriendshipRequestSerializer
	permission_classes = [IsAuthenticated]

	def get(self, request):
		user_id = request.data.get('id')
		user = Player.objects.filter(id=user_id)
		sent = FriendshipRequest.objects.filter(from_user=user)
		recieved = FriendshipRequest.objects.filter(to_user=user)
		serialized_sent = FriendshipRequestSerializer(sent, many=True)
		serialized_recieved = FriendshipRequestSerializer(recieved, many=True)
		data = {
			# 'sent' : serialized_sent.data,
			'recieved' : serialized_recieved.data,
		}
		return Response(data, status = status.HTTP_200_OK)


class TokenVerifyView(APIView):
	permission_classes = [AllowAny]
	def post(self, request, *args, **kwargs):
		token = request.data.get('token')

		try:
			payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
			user_id = payload["user_id"]
			player = get_object_or_404(get_user_model(), pk=user_id)
		except jwt.ExpiredSignatureError:
			return Response({'detail': 'Token expired'}, status=status.HTTP_401_UNAUTHORIZED)
		except jwt.InvalidTokenError:
			return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
		except Player.DoesNotExist:
				return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
		return Response({'detail': 'Token valid'}, status=status.HTTP_200_OK)

def getGameInvites(request, invites_id):
	try :
		if request.method == 'GET':
			InviteObj = Invites.objects.get(id=invites_id)
			return JsonResponse({'sender': InviteObj.sender.username, 'receiver': InviteObj.receiver.username}, safe=False)
		return JsonResponse({'status': 'method not allowed'}, status=405)
	except Invites.DoesNotExist:
		return JsonResponse({'status': 'no gameInvite provided with the following id'}, status=404)