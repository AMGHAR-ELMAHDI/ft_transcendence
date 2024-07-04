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

class SignInAPIView(APIView):
    queryset = Player.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user_has_device(user):
                request.session['pre_2fa_user_id'] = user.id
                print('[SignInAPIView]  there is a device')
                return Response({'detail': '2fa_required'}, status=status.HTTP_200_OK)
            else:
                print('[SignInAPIView]  no device')
                refresh = RefreshToken.for_user(user)
                login(request, user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class SignUpAPIView(APIView):
    queryset = Player.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response({'status': 'Account created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TwoFactorSetupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        device, created = TOTPDevice.objects.get_or_create(user=user, name='default')
        return Response({'secret': device.config_url}, status=status.HTTP_200_OK)

class TwoFactorVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.session.get('pre_2fa_user_id')
        user = User.objects.get(id=user_id)
        form = OTPTokenForm(user, data=request.data)
        if form.is_valid():
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid 2FA code'}, status=status.HTTP_400_BAD_REQUEST)