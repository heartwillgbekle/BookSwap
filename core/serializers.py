# core/serializers.py

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Listing

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # This method is called when creating a new user.
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class ListingSerializer(serializers.ModelSerializer):
    seller = serializers.ReadOnlyField(source='seller.username')
    seller_email = serializers.ReadOnlyField(source='seller.email')

    class Meta:
        model = Listing
        fields = ['id', 'title', 'author', 'isbn', 'condition', 'price', 'cover_image_url', 'seller', 'seller_email', 'created_at']
        read_only_fields = ['id', 'seller', 'created_at']