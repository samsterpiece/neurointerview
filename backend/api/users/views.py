# users/views.py
from django.contrib.auth import get_user_model
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from backend.api.users.permissions import IsOwnerOrAdmin
from backend.api.users.serializers import UserProfileSerializer, UserSerializer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint for users"""

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action in ["retrieve", "me"]:
            return UserProfileSerializer
        return UserSerializer

    @action(detail=False, methods=["get"])
    def me(self, request):
        """Get the current user's profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["put", "patch"])
    def update_preferences(self, request):
        """Update user preferences"""
        user = request.user

        # Update preference fields
        for field in [
            "prefers_segmented_sessions",
            "prefers_extra_time",
            "prefers_text_communication",
            "prefers_visual_aids",
            "prefers_literal_language",
            "prefers_dyslexia_formatting",
        ]:
            if field in request.data:
                setattr(user, field, request.data[field])

        # Update custom preferences if provided
        if "custom_preferences" in request.data:
            user.custom_preferences = request.data["custom_preferences"]

        user.save()
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
