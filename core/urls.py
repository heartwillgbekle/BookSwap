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
    path('register/', RegisterView.as_view(), name='register'),
    path('books/lookup/', BookLookupView.as_view(), name='book-lookup'),
    path('listings/', ListingListView.as_view(), name='listing-list'),
    path('listings/create/', ListingCreateView.as_view(), name='listing-create'),
    path('listings/delete/<int:pk>/', ListingDeleteView.as_view(), name='listing-delete'),
]


