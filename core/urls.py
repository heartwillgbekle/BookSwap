# core/urls.py
from django.urls import path
from .views import (
    BookLookupView, 
    ListingCreateView, 
    ListingListView, 
    ListingDeleteView, 
    RegisterView 
)

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/books/lookup/', BookLookupView.as_view(), name='lookup'),
    path('api/listings/', ListingListView.as_view(), name='listings'),
    path('api/listings/create/', ListingCreateView.as_view(), name='create'),
    path('api/listings/delete/<int:pk>/', ListingDeleteView.as_view(), name='delete'),
]


