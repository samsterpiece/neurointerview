# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user creation and listing"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'user_type']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Detailed user profile serializer"""

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'user_type',
            'profile_picture', 'is_adhd', 'is_asd', 'is_dyslexia', 'is_social_anxiety',
            'prefers_segmented_sessions', 'prefers_extra_time', 'prefers_text_communication',
            'prefers_visual_aids', 'prefers_literal_language', 'prefers_dyslexia_formatting',
            'custom_preferences', 'date_joined'
        ]
        read_only_fields = ['id', 'username', 'email', 'date_joined']

