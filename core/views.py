# core/views.py

from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
# Add these imports
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from decouple import config
from .models import Listing 
from .serializers import UserSerializer, ListingSerializer 
from django.http import HttpResponse
from rest_framework.generics import ListAPIView
from .serializers import UserSerializer
from django.contrib.auth.models import User

User = get_user_model()

# Keep your existing CreateUserView
class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system"""
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Add this new view
class BookLookupView(APIView):
    """Look up book details from Google Books API using ISBN"""
    def get(self, request):
        isbn = request.query_params.get('isbn')
        if not isbn:
            return Response({'error': 'ISBN query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

        api_key = config('GOOGLE_BOOKS_API_KEY')
        url = f'https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&key={api_key}'

        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise an exception for bad status codes
            data = response.json()

            if 'items' in data and data['items']:
                book_info = data['items'][0]['volumeInfo']
                authors = book_info.get('authors', ['N/A'])

                prefill_data = {
                    'title': book_info.get('title', ''),
                    'author': ', '.join(authors),
                    'cover_image_url': book_info.get('imageLinks', {}).get('thumbnail', '')
                }
                return Response(prefill_data)
            else:
                return Response({'error': 'Book not found for the given ISBN.'}, status=status.HTTP_404_NOT_FOUND)

        except requests.exceptions.RequestException as e:
            return Response({'error': f'Failed to connect to Google Books API: {e}'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class ListingCreateView(generics.CreateAPIView):
    """Create a new listing"""
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated] # <-- This protects the endpoint

    def perform_create(self, serializer):
        """Set the seller to the currently logged-in user."""
        serializer.save(seller=self.request.user)

def home_view(request):
    return HttpResponse("<h1>BookSwap API is Live!</h1>")

class ListingListView(ListAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    # This view doesn't need login, so anyone can see the books for sale!
    permission_classes = []

from rest_framework.generics import ListAPIView


class ListingListView(ListAPIView):
    queryset = Listing.objects.all().order_by('-created_at') 
    serializer_class = ListingSerializer
    permission_classes = [] 


# 1. User Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny] # Anyone can sign up
    def post(self, request):
        user = User.objects.create_user(
            username=request.data['username'],
            password=request.data['password'],
            email=request.data.get('email', '')
        )
        return Response({"message": "User created successfully"}, status=201)

# 2. Delete Listing View
class ListingDeleteView(generics.DestroyAPIView):
    queryset = Listing.objects.all()
    permission_classes = [permissions.IsAuthenticated] # Only logged-in users can delete

    def get_queryset(self):
        # Security: Users can only delete their OWN listings
        return self.queryset.filter(seller=self.request.user)