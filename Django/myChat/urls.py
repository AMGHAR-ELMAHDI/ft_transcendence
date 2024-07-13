from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from two_factor.urls import urlpatterns as tf_urls

schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)
# from two_factor.urls import urlpatterns as tf_urls

urlpatterns = [
   path('admin/', admin.site.urls),
   path('', include('chat.urls')),
   # path('', include('online.urls')),
   path('', include('Oauth2.urls')),
   path('', include('userman.urls')),
   path('', include('purshase.urls')),
   path('game/', include('online.urls')),

   # path('auth/', include('djoser.urls')),
   # path('auth/', include('djoser.urls.jwt')),
   path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
   path('', include(tf_urls)),
]

if settings.DEBUG:
	urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)