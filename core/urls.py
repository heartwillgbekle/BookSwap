# core/urls.py
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token 
from .views import (
    HomeView,          
    BookLookupView, 
    ListingCreateView, 
    ListingListView, 
    ListingDeleteView, 
    RegisterView 
)

urlpatterns = [
    # 1. The Homepage (Loads your index.html)
    path('', HomeView.as_view(), name='home'),

    # 2. Login Endpoint (Handles the JS login request)
    path('api/login/', obtain_auth_token, name='login'),

    # 3. API Endpoints
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/books/lookup/', BookLookupView.as_view(), name='lookup'),
    path('api/listings/', ListingListView.as_view(), name='listings'),
    path('api/listings/create/', ListingCreateView.as_view(), name='create'),
    path('api/listings/delete/<int:pk>/', ListingDeleteView.as_view(), name='delete'),
]
