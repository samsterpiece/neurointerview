# companies/views.py
from api.companies.models import Company, CompanyJobPosition
from api.companies.serializers import (
    CompanyDetailSerializer,
    CompanySerializer,
    JobPositionSerializer,
)
from api.users.permissions import IsCompanyAdmin
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response


class CompanyViewSet(viewsets.ModelViewSet):
    """API endpoint for companies"""

    queryset = Company.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CompanyDetailSerializer
        return CompanySerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            permission_classes = [IsCompanyAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=["get"])
    def job_positions(self, request, pk=None):
        """Get job positions for a company"""
        company = self.get_object()
        positions = company.job_positions.all()
        serializer = JobPositionSerializer(positions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def my_companies(self, request):
        """Get companies administered by the current user"""
        companies = request.user.administered_companies.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)


class JobPositionViewSet(viewsets.ModelViewSet):
    """API endpoint for job positions"""

    queryset = CompanyJobPosition.objects.all()
    serializer_class = JobPositionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter positions by company if company_id is provided"""
        queryset = CompanyJobPosition.objects.all()
        company_id = self.request.query_params.get("company_id")
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset
