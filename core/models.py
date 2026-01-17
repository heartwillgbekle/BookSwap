from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # We can add extra fields here later, like a profile picture
    email = models.EmailField(unique=True)

class Listing(models.Model):
    CONDITION_CHOICES = [
        ('LIKE_NEW', 'Like New'),
        ('GOOD', 'Good'),
        ('FAIR', 'Fair'),
        ('POOR', 'Poor'),
    ]

    seller = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=13, blank=True, null=True)
    cover_image_url = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    condition = models.CharField(max_length=8, choices=CONDITION_CHOICES)
    course_code = models.CharField(max_length=20, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # If the user didn't provide a URL but provided an ISBN
        if not self.cover_image_url and self.isbn:
            # Generate the Open Library cover link automatically
            self.cover_image_url = f"https://covers.openlibrary.org/b/isbn/{self.isbn}-M.jpg"
        super().save(*args, **kwargs)

    CATEGORY_CHOICES = [
        ('STEM', 'Science & Tech'),
        ('Business & Econs', 'Business & Econ'),
        ('Humanities', 'Humanities'),
        ('Art', 'Arts & Design'),
        ('General', 'General / Other'),
    ]
    
    category = models.CharField(
        max_length=100, 
        choices=CATEGORY_CHOICES, 
        default='GEN'
    )

    def __str__(self):
        return f'"{self.title}" by {self.author} for ${self.price}'

class Conversation(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    buyer = models.ForeignKey(User, related_name='buyer_conversations', on_delete=models.CASCADE)
    
    # The seller is implicitly known via the listing, but this can be useful
    seller = models.ForeignKey(User, related_name='seller_conversations', on_delete=models.CASCADE)

    class Meta:
        # Ensures a buyer can't start multiple conversations for the same book
        unique_together = ('listing', 'buyer')

    def __str__(self):
        return f'Conversation about "{self.listing.title}" between {self.buyer.username} and {self.seller.username}'

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.sender.username} at {self.timestamp.strftime("%Y-%m-%d %H:%M")}'