# companies/serializers.py
from rest_framework import serializers
from .models import Company, CompanyJobPosition
from users.serializers import UserSerializer


class CompanySerializer(serializers.ModelSerializer):
    """Basic company serializer"""

    class Meta:
        model = Company
        fields = ['id', 'name', 'logo', 'website', 'is_active']


class JobPositionSerializer(serializers.ModelSerializer):
    """Job position serializer"""
    company_name = serializers.ReadOnlyField(source='company.name')

    class Meta:
        model = CompanyJobPosition
        fields = ['id', 'company', 'company_name', 'title', 'description', 'skills_required', 'is_active', 'created_at']


class CompanyDetailSerializer(serializers.ModelSerializer):
    """Detailed company serializer with related data"""
    admins = UserSerializer(many=True, read_only=True)
    job_positions = JobPositionSerializer(many=True, read_only=True)

    class Meta:
        model = Company
        fields = ['id', 'name', 'logo', 'description', 'website', 'admins', 'job_positions', 'is_active', 'created_at',
                  'updated_at']
