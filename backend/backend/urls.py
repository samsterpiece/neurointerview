# # api/urls.py
from api.assessments.views import SubmissionViewSet
from api.views import (
    AssessmentViewSet,
    CandidateAssessmentViewSet,
    CompanyViewSet,
    JobPositionViewSet,
    ProblemViewSet,
    UserViewSet,
)
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"companies", CompanyViewSet)
router.register(r"job-positions", JobPositionViewSet)
router.register(r"problems", ProblemViewSet)
router.register(r"assessments", AssessmentViewSet)
router.register(r"candidate-assessments", CandidateAssessmentViewSet)
router.register(r"submissions", SubmissionViewSet)

# URL patterns
urlpatterns = [
    # Include all router URLs
    path("", include(router.urls)),
    # JWT authentication endpoints
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
