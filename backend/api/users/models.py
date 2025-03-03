# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended user model with additional fields for neurodivergent profiles"""

    # Add name field
    name = models.CharField(max_length=255, blank=True)
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="api_user_groups",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="api_user_permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )
    USER_TYPE_CHOICES = (
        ("candidate", "Candidate"),
        ("company", "Company"),
        ("admin", "Admin"),
    )

    user_type = models.CharField(
        max_length=20, choices=USER_TYPE_CHOICES, default="candidate"
    )
    profile_picture = models.ImageField(
        upload_to="profile_pictures/", null=True, blank=True
    )

    # Neurodivergent profile flags - users can select multiple
    is_adhd = models.BooleanField(default=False)
    is_asd = models.BooleanField(default=False)  # Autism Spectrum
    is_dyslexia = models.BooleanField(default=False)
    is_social_anxiety = models.BooleanField(default=False)

    # User preferences for interview accommodations
    prefers_segmented_sessions = models.BooleanField(default=False)
    prefers_extra_time = models.BooleanField(default=False)
    prefers_text_communication = models.BooleanField(default=False)
    prefers_visual_aids = models.BooleanField(default=False)
    prefers_literal_language = models.BooleanField(default=False)
    prefers_dyslexia_formatting = models.BooleanField(default=False)

    # Custom preferences as JSON
    custom_preferences = models.JSONField(null=True, blank=True)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        # Prefer name, fall back to username
        return self.name or self.username
