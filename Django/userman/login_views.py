from django.forms import ValidationError
from rest_framework import status, viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .models import Player
from django.contrib.auth.models import User
from rest_framework.views import APIView
from django.shortcuts import render, redirect
from django_otp import user_has_device
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.forms import OTPTokenForm
from django.contrib.auth.password_validation import validate_password
from django.core.cache import cache

from .utils import getLogging

logger = getLogging()

def user_has_device(user):
    return TOTPDevice.objects.filter(user=user, confirmed=True).exists()


class SignInAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        cache_key = f"login_attempts_{username}"
        attempts = cache.get(cache_key, 0)
        
        if attempts >= 5:
            return Response({'error': 'Too many login attempts. Please try again later.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            cache.delete(cache_key)
            if user_has_device(user):
                request.session['pre_2fa_user_id'] = user.id
                logger.info(f"[SignInAPIView] 2FA required for user {username}")
                return Response({'detail': '2fa_required'}, status=status.HTTP_200_OK)
            else:
                refresh = RefreshToken.for_user(user)
                login(request, user)
                logger.info(f"[SignInAPIView] User {username} logged in successfully")
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
        else:
            cache.set(cache_key, attempts + 1, timeout=300)  
            logger.critical(f"[SignInAPIView] Invalid login attempt for username {username}")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class SignUpAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')

            if Player.objects.filter(email=email).exists():
                    return Response({'email': 'This email is already in use.'}, status=status.HTTP_400_BAD_REQUEST)
            if Player.objects.filter(username=username).exists():
                    return Response({'username': 'This username is already in use.'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                validate_password(password)
            except ValidationError as e:
                return Response({'password': e.messages}, status=status.HTTP_400_BAD_REQUEST)
            
            user = serializer.save()
            user.set_password(password)
            user.save()
            return Response({'status': 'Account created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TwoFactorSetupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        device, created = TOTPDevice.objects.get_or_create(user=user, name='default')
        return Response({'secret': device.config_url}, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        device, created = TOTPDevice.objects.get_or_create(user=user, name='default')
        code = request.data.get('code')
        if code and device.verify_token(code):
            device.confirmed = True
            device.save()
            return Response({'status': '2FA set up successfully!'}, status=status.HTTP_200_OK)
        return Response({'status': '2FA setup failed!'}, status=status.HTTP_400_BAD_REQUEST)

class TwoFactorVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.session.get('pre_2fa_user_id')
        if not user_id:
            return Response({'error': 'No user in session'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = Player.objects.get(id=user_id)
        code = request.data.get('code')
        device = TOTPDevice.objects.filter(user=user, confirmed=True).first()

        if device and device.verify_token(code):
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid 2FA code'}, status=status.HTTP_400_BAD_REQUEST)