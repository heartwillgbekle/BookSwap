# bookswap_project/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin Panel
    path('admin/', admin.site.urls),
    
    # Send EVERYTHING else to core/urls.py
    # We use empty string '' so it doesn't add any extra prefixes
    path('', include('core.urls')), 
    path('api/dj-rest-auth/', include('dj_rest_auth.urls')),
    path('api/dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]