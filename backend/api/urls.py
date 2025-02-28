# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from users.views import UserViewSet
from companies.views import CompanyViewSet, JobPositionViewSet
from assessments.views import (
    ProblemViewSet, AssessmentViewSet,
    CandidateAssessmentViewSet, SubmissionViewSet
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'job-positions', JobPositionViewSet)
router.register(r'problems', ProblemViewSet)
router.register(r'assessments', AssessmentViewSet)
router.register(r'candidate-assessments', CandidateAssessmentViewSet)
router.register(r'submissions', SubmissionViewSet)

# URL patterns
urlpatterns = [
    # Include all router URLs
    path('', include(router.urls)),

    # JWT authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]