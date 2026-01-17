from django.contrib import admin

# Register your models here.
# core/admin.py
from django.contrib import admin
from .models import Listing

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'price', 'category') # These columns show in the list