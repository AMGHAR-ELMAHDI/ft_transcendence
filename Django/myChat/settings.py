from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv()

# Base Directory and Settings Initialization
BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_ALLOW_ALL = True

INSTALLED_APPS = [
    'daphne',
    
    # Django built-in apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'djoser',
    'corsheaders',
    'django_extensions',
    'django_otp',
    'django_otp.plugins.otp_static',
    'django_otp.plugins.otp_totp',
    'two_factor',
    'drf_yasg',

    # # Custom apps
    'userman',
    'Oauth2',
    'online',
    'chat',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django_otp.middleware.OTPMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS and URL Configuration
CORS_ALLOW_ALL_ORIGINS = True
ROOT_URLCONF = 'myChat.urls'
ASGI_APPLICATION = 'myChat.asgi.application'

# Custom Authentication and JWT Settings
AUTH_USER_MODEL = 'userman.Player'

DJOSER = {
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'SET_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'USERNAME_RESET_CONFIRM_URL': 'email/reset/confirm/{uid}/{token}',
    'LOGOUT_ON_PASSWORD_CHANGE': True,
    'SERIALIZERS': {
        'user_create': 'userman.serializers.PlayerCreateSerializer',
    },
}

# SWAGGER_SETTINGS = {
#     'VALIDATOR_URL': 'http://localhost:8189',
# }

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

from datetime import timedelta
SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1)
}

# Channel Layers and Templates Configuration
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

# CHANNEL_LAYERS = {
#     "default": {
#         "BACKEND": "channels_redis.pubsub.RedisPubSubChannelLayer",
#         "CONFIG": {
#             "hosts": [("redis", 6379)],
#         },
#     },
# }

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# CORS Headers and Email Settings
CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOW_HEADERS = ["accept", "referer", "accept-encoding", "authorization", "content-type", "dnt", "origin", "user-agent", "x-csrftoken", "x-sessionid", "x-requested-with"]
CORS_EXPOSE_HEADERS = ['Set-Cookie']

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_PORT = int(os.getenv('EMAIL_PORT'))
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'False') == 'True'
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'False') == 'True'



# Database Configuration
# use this to work without docker 
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db5.sqlite3',
    }
}

# use this to work with docker 
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.getenv('POSTGRES_DB'),
#         'USER': os.getenv('POSTGRES_USER'),
#         'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
#         'HOST': os.getenv('POSTGRES_HOST'),
#         'PORT': int(os.getenv('POSTGRES_PORT')),
#     }
# }

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

GRAPH_MODELS = {
    'all_applications': True,
    'group_models': True,
}

GRAPH_MODELS = {
    'app_labels': ["chat", "userman"],
}

LOGIN_REDIRECT_URL = 'http://localhost:2500/auth/jwt/create'


LOGIN_URL = 'two_factor:login'


# Discord Oauth

D_CLIENT_ID = os.getenv('D_CLIENT_ID')
D_CLIENT_SECRET = os.getenv('D_CLIENT_SECRET')
D_GRANT_TYPE = os.getenv('D_GRANT_TYPE')
D_REDIRECT_URI = os.getenv('D_REDIRECT_URI')
D_SCOPE = os.getenv('D_SCOPE')
D_URI = os.getenv('D_URI')

# 42 Oauth

F_CLIENT_ID = os.getenv('F_CLIENT_ID')
F_CLIENT_SECRET = os.getenv('F_CLIENT_SECRET')
F_GRANT_TYPE = os.getenv('F_GRANT_TYPE')
F_REDIRECT_URI = os.getenv('F_REDIRECT_URI')
F_SCOPE = os.getenv('F_SCOPE')
F_URI = os.getenv('F_URI')


F_HOST = os.getenv('F_HOST')
B_HOST = os.getenv('B_HOST')
# Error pages

HTTP_400_BAD_REQUEST = f'http://{F_HOST}:5173/400'
HTTP_401_UNAUTHORIZED = f'http://{F_HOST}:5173/401'
HTTP_403_FORBIDDEN = f'http://{F_HOST}:5173/403'

