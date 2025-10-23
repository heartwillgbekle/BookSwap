# core/urls.py

from django.urls import path
# Update this import
from .views import CreateUserView, BookLookupView, ListingCreateView
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('books/lookup/', BookLookupView.as_view(), name='book-lookup'),
    # Add this line for creating listings
    path('listings/', ListingCreateView.as_view(), name='listing-create'),
]