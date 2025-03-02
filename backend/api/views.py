# # api/views.py
# from api.assessments.models import (
#     Assessment,
#     CandidateAssessment,
#     Problem,
#     Submission,
# )
# from api.assessments.serializers import (
#     AssessmentDetailSerializer,
#     AssessmentSerializer,
#     CandidateAssessmentSerializer,
#     ProblemDetailSerializer,
#     ProblemSerializer,
#     SubmissionSerializer,
# )
# from api.companies.models import Company
# from api.users.permissions import IsCompanyAdmin, IsOwnerOrAdmin
# from api.users.serializers import UserProfileSerializer, UserSerializer
# from django.contrib.auth import get_user_model
# from django.db.models import Q
# from django.shortcuts import get_object_or_404
# from django.utils import timezone
# from rest_framework import permissions, status, viewsets
# from rest_framework.decorators import action
# from rest_framework.response import Response
#
# User = get_user_model()
#
#
# class UserViewSet(viewsets.ModelViewSet):
#     """API endpoint for users"""
#
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#
#     def get_permissions(self):
#         if self.action == "create":
#             permission_classes = [AllowAny]
#         elif self.action in ["update", "partial_update", "destroy"]:
#             permission_classes = [IsOwnerOrAdmin]
#         else:
#             permission_classes = [IsAuthenticated]
#         return [permission() for permission in permission_classes]
#
#     def get_serializer_class(self):
#         if self.action in ["retrieve", "me"]:
#             return UserProfileSerializer
#         return UserSerializer
#
#     @action(detail=False, methods=["get"])
#     def me(self, request):
#         """Get the current user's profile"""
#         serializer = self.get_serializer(request.user)
#         return Response(serializer.data)
#
#     @action(detail=False, methods=["put", "patch"])
#     def update_preferences(self, request):
#         """Update user preferences"""
#         user = request.user
#
#         # Update preference fields
#         for field in [
#             "prefers_segmented_sessions",
#             "prefers_extra_time",
#             "prefers_text_communication",
#             "prefers_visual_aids",
#             "prefers_literal_language",
#             "prefers_dyslexia_formatting",
#         ]:
#             if field in request.data:
#                 setattr(user, field, request.data[field])
#
#         # Update custom preferences if provided
#         if "custom_preferences" in request.data:
#             user.custom_preferences = request.data["custom_preferences"]
#
#         user.save()
#         serializer = UserProfileSerializer(user)
#         return Response(serializer.data)
#
#
# class CompanyViewSet(viewsets.ModelViewSet):
#     """API endpoint for companies"""
#
#     queryset = Company.objects.all()
#
#     def get_serializer_class(self):
#         if self.action == "retrieve":
#             return CompanyDetailSerializer
#         return CompanySerializer
#
#     def get_permissions(self):
#         if self.action in ["create", "update", "partial_update", "destroy"]:
#             permission_classes = [IsCompanyAdmin]
#         else:
#             permission_classes = [permissions.IsAuthenticated]
#         return [permission() for permission in permission_classes]
#
#     @action(detail=True, methods=["get"])
#     def job_positions(self, request, pk=None):
#         """Get job positions for a company"""
#         company = self.get_object()
#         positions = company.job_positions.all()
#         serializer = JobPositionSerializer(positions, many=True)
#         return Response(serializer.data)
#
#     @action(detail=False, methods=["get"])
#     def my_companies(self, request):
#         """Get companies administered by the current user"""
#         companies = request.user.administered_companies.all()
#         serializer = CompanySerializer(companies, many=True)
#         return Response(serializer.data)
#
#
# class JobPositionViewSet(viewsets.ModelViewSet):
#     """API endpoint for job positions"""
#
#     queryset = CompanyJobPosition.objects.all()
#     serializer_class = JobPositionSerializer
#     permission_classes = [permissions.IsAuthenticated]
#
#     def get_queryset(self):
#         """Filter positions by company if company_id is provided"""
#         queryset = CompanyJobPosition.objects.all()
#         company_id = self.request.query_params.get("company_id")
#         if company_id:
#             queryset = queryset.filter(company_id=company_id)
#         return queryset
#
#
# class ProblemViewSet(viewsets.ModelViewSet):
#     """API endpoint for problems"""
#
#     queryset = Problem.objects.all()
#
#     def get_serializer_class(self):
#         if self.action == "retrieve":
#             return ProblemDetailSerializer
#         return ProblemSerializer
#
#     def get_permissions(self):
#         if self.action in ["create", "update", "partial_update", "destroy"]:
#             permission_classes = [IsCompanyAdmin]
#         else:
#             permission_classes = [permissions.IsAuthenticated]
#         return [permission() for permission in permission_classes]
#
#     def get_queryset(self):
#         """
#         Filter problems:
#         - Company admins can see their company's problems and public problems
#         - Regular users can only see public problems
#         """
#         user = self.request.user
#
#         # Get companies where the user is an admin
#         admin_companies = user.administered_companies.all()
#
#         if admin_companies.exists():
#             # Company admins see their problems and public ones
#             company_ids = admin_companies.values_list("id", flat=True)
#             return Problem.objects.filter(
#                 Q(company_id__in=company_ids) | Q(is_public=True)
#             )
#
#         # Regular users only see public problems
#         return Problem.objects.filter(is_public=True)
#
#
# class AssessmentViewSet(viewsets.ModelViewSet):
#     """API endpoint for assessments"""
#
#     queryset = Assessment.objects.all()
#
#     def get_serializer_class(self):
#         if self.action == "retrieve":
#             return AssessmentDetailSerializer
#         return AssessmentSerializer
#
#     def get_permissions(self):
#         if self.action in ["create", "update", "partial_update", "destroy"]:
#             permission_classes = [IsCompanyAdmin]
#         else:
#             permission_classes = [permissions.IsAuthenticated]
#         return [permission() for permission in permission_classes]
#
#     def get_queryset(self):
#         """
#         Filter assessments:
#         - Company admins see their company's assessments
#         - Candidates see assessments assigned to them
#         """
#         user = self.request.user
#
#         # Get companies where the user is an admin
#         admin_companies = user.administered_companies.all()
#
#         if admin_companies.exists():
#             # Company admins see their company's assessments
#             company_ids = admin_companies.values_list("id", flat=True)
#             return Assessment.objects.filter(company_id__in=company_ids)
#
#         # Candidates see assessments assigned to them
#         return Assessment.objects.filter(candidateassessment__candidate=user)
#
#     @action(detail=True, methods=["post"])
#     def assign_candidates(self, request, pk=None):
#         """Assign candidates to an assessment"""
#         assessment = self.get_object()
#         candidate_ids = request.data.get("candidate_ids", [])
#
#         # Create CandidateAssessment instances
#         for candidate_id in candidate_ids:
#             CandidateAssessment.objects.get_or_create(
#                 assessment=assessment,
#                 candidate_id=candidate_id,
#                 defaults={"status": "invited"},
#             )
#
#         return Response(
#             {"status": "candidates assigned"}, status=status.HTTP_201_CREATED
#         )
#
#
# class CandidateAssessmentViewSet(viewsets.ModelViewSet):
#     """API endpoint for candidate assessments"""
#
#     queryset = CandidateAssessment.objects.all()
#     serializer_class = CandidateAssessmentSerializer
#     permission_classes = [permissions.IsAuthenticated]
#
#     def get_queryset(self):
#         """
#         Filter candidate assessments:
#         - Company admins see their company's candidate assessments
#         - Candidates see their own assessments
#         """
#         user = self.request.user
#
#         # Get companies where the user is an admin
#         admin_companies = user.administered_companies.all()
#
#         if admin_companies.exists():
#             # Company admins see their company's candidate assessments
#             company_ids = admin_companies.values_list("id", flat=True)
#             return CandidateAssessment.objects.filter(
#                 assessment__company_id__in=company_ids
#             )
#
#         # Candidates see their own assessments
#         return CandidateAssessment.objects.filter(candidate=user)
#
#     @action(detail=True, methods=["post"])
#     def start(self, request, pk=None):
#         """Start an assessment"""
#         candidate_assessment = self.get_object()
#
#         # Verify the candidate is the current user
#         if candidate_assessment.candidate != request.user:
#             return Response(
#                 {"error": "Only the assigned candidate can start this assessment"},
#                 status=status.HTTP_403_FORBIDDEN,
#             )
#
#         # Update status and start time
#         candidate_assessment.status = "started"
#         candidate_assessment.started_at = timezone.now()
#         candidate_assessment.save()
#
#         serializer = self.get_serializer(candidate_assessment)
#         return Response(serializer.data)
#
#     @action(detail=True, methods=["post"])
#     def submit(self, request, pk=None):
#         """Submit an assessment"""
#         candidate_assessment = self.get_object()
#
#         # Verify the candidate is the current user
#         if candidate_assessment.candidate != request.user:
#             return Response(
#                 {"error": "Only the assigned candidate can submit this assessment"},
#                 status=status.HTTP_403_FORBIDDEN,
#             )
#
#         # Update status and completion time
#         candidate_assessment.status = "completed"
#         candidate_assessment.completed_at = timezone.now()
#         candidate_assessment.save()
#
#         serializer = self.get_serializer(candidate_assessment)
#         return Response(serializer.data)
#
#     @action(detail=True, methods=["post"])
#     def request_extension(self, request, pk=None):
#         """Request time extension for an assessment"""
#         candidate_assessment = self.get_object()
#
#         #
