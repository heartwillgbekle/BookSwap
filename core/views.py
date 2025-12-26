# core/views.py

from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from decouple import config
import requests

from .models import Listing 
from .serializers import UserSerializer, ListingSerializer 

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class HomeView(View):
    """Serves the main frontend index.html"""
    def get(self, request):
        return render(request, 'core/index.html')

class RegisterView(APIView):
    """Handles User Registration"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        # 'name' can be stored in first_name or a custom profile if you expand later
        
        if not username or not password:
            return Response({"error": "Missing username or password"}, status=status.HTTP_400_BAD_REQUEST)
            
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, password=password)
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class BookLookupView(APIView):
    """
    Look up book details from Google Books API.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        isbn = request.query_params.get('isbn')
        query = request.query_params.get('q')
        
        if not isbn and not query:
            return Response({'error': 'Provide an ISBN or a search query (q).'}, status=status.HTTP_400_BAD_REQUEST)

        api_key = config('GOOGLE_BOOKS_API_KEY', default=None)
        
        # Determine search string
        if isbn:
            search_param = f"isbn:{isbn}"
        else:
            search_param = query

        # Base URL
        url = f'https://www.googleapis.com/books/v1/volumes?q={search_param}&maxResults=1'
        
        # Only append Key if it actually exists
        if api_key:
            url += f'&key={api_key}'

        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            if 'items' in data and data['items']:
                book_info = data['items'][0]['volumeInfo']
                ids = book_info.get('industryIdentifiers', [])
                
                # Get ISBN safely
                found_isbn = next((identifier['identifier'] for identifier in ids 
                                 if identifier['type'] == 'ISBN_13'), isbn or "0000000000000")

                # Handle missing images safely
                image_links = book_info.get('imageLinks') or {}
                cover = image_links.get('thumbnail') or image_links.get('smallThumbnail', '')

                prefill_data = {
                    'title': book_info.get('title', 'Unknown Title'),
                    'author': ', '.join(book_info.get('authors', ['Unknown Author'])),
                    'cover_image_url': cover,
                    'isbn': found_isbn
                }
                return Response(prefill_data)
            else:
                return Response({'error': 'No book found for that query.'}, status=status.HTTP_404_NOT_FOUND)

        except requests.exceptions.RequestException as e:
            return Response({'error': f'Google API Error: {str(e)}'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

class ListingCreateView(generics.CreateAPIView):
    """Creates a new book listing and assigns the logged-in user as seller"""
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class ListingListView(ListAPIView):
    """Returns all listings, ordered by newest first"""
    queryset = Listing.objects.all().order_by('-created_at') 
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]

class ListingDeleteView(generics.DestroyAPIView):
    """Deletes a listing. User must be the seller."""
    queryset = Listing.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Security: Filter queryset so user can only delete their own books
        return self.queryset.filter(seller=self.request.user)