# assessments/views.py
from api.assessments.models import (
    Assessment,
    CandidateAssessment,
    Problem,
    Submission,
)
from api.assessments.serializers import (
    AssessmentDetailSerializer,
    AssessmentSerializer,
    CandidateAssessmentSerializer,
    ProblemDetailSerializer,
    ProblemSerializer,
)
from api.users.permissions import IsCompanyAdmin
from django.db.models import Q
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response


class ProblemViewSet(viewsets.ModelViewSet):
    """API endpoint for problems"""

    queryset = Problem.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProblemDetailSerializer
        return ProblemSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            permission_classes = [IsCompanyAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Filter problems:
        - Company admins can see their company's problems and public problems
        - Regular users can only see public problems
        """
        user = self.request.user

        # Get companies where the user is an admin
        admin_companies = user.administered_companies.all()

        if admin_companies.exists():
            # Company admins see their problems and public ones
            company_ids = admin_companies.values_list("id", flat=True)
            return Problem.objects.filter(
                Q(company_id__in=company_ids) | Q(is_public=True)
            )

        # Regular users only see public problems
        return Problem.objects.filter(is_public=True)


class AssessmentViewSet(viewsets.ModelViewSet):
    """API endpoint for assessments"""

    queryset = Assessment.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return AssessmentDetailSerializer
        return AssessmentSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            permission_classes = [IsCompanyAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Filter assessments:
        - Company admins see their company's assessments
        - Candidates see assessments assigned to them
        """
        user = self.request.user

        # Get companies where the user is an admin
        admin_companies = user.administered_companies.all()

        if admin_companies.exists():
            # Company admins see their company's assessments
            company_ids = admin_companies.values_list("id", flat=True)
            return Assessment.objects.filter(company_id__in=company_ids)

        # Candidates see assessments assigned to them
        return Assessment.objects.filter(candidateassessment__candidate=user)

    @action(detail=True, methods=["post"])
    def assign_candidates(self, request, pk=None):
        """Assign candidates to an assessment"""
        assessment = self.get_object()
        candidate_ids = request.data.get("candidate_ids", [])

        # Create CandidateAssessment instances
        for candidate_id in candidate_ids:
            CandidateAssessment.objects.get_or_create(
                assessment=assessment,
                candidate_id=candidate_id,
                defaults={"status": "invited"},
            )

        return Response(
            {"status": "candidates assigned"}, status=status.HTTP_201_CREATED
        )


class CandidateAssessmentViewSet(viewsets.ModelViewSet):
    """API endpoint for candidate assessments"""

    queryset = CandidateAssessment.objects.all()
    serializer_class = CandidateAssessmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filter candidate assessments:
        - Company admins see their company's candidate assessments
        - Candidates see their own assessments
        """
        user = self.request.user

        # Get companies where the user is an admin
        admin_companies = user.administered_companies.all()

        if admin_companies.exists():
            # Company admins see their company's candidate assessments
            company_ids = admin_companies.values_list("id", flat=True)
            return CandidateAssessment.objects.filter(
                assessment__company_id__in=company_ids
            )

        # Candidates see their own assessments
        return CandidateAssessment.objects.filter(candidate=user)

    @action(detail=True, methods=["post"])
    def start(self, request, pk=None):
        """Start an assessment"""
        candidate_assessment = self.get_object()

        # Verify the candidate is the current user
        if candidate_assessment.candidate != request.user:
            return Response(
                {"error": "Only the assigned candidate can start this assessment"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Update status and start time
        candidate_assessment.status = "started"
        candidate_assessment.started_at = timezone.now()
        candidate_assessment.save()

        serializer = self.get_serializer(candidate_assessment)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        """Submit an assessment"""
        candidate_assessment = self.get_object()

        # Verify the candidate is the current user
        if candidate_assessment.candidate != request.user:
            return Response(
                {"error": "Only the assigned candidate can submit this assessment"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Update status and completion time
        candidate_assessment.status = "completed"
        candidate_assessment.completed_at = timezone.now()
        candidate_assessment.save()

        serializer = self.get_serializer(candidate_assessment)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def request_extension(self, request, pk=None):
        """Request time extension for an assessment"""
        candidate_assessment = self.get_object()


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
