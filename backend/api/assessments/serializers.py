# assessments/serializers.py
from api.companies.serializers import CompanySerializer, JobPositionSerializer
from api.users.serializers import UserSerializer
from rest_framework import serializers

from .models import Assessment, CandidateAssessment, Problem, Submission


class ProblemSerializer(serializers.ModelSerializer):
    """Basic problem serializer"""

    company_name = serializers.ReadOnlyField(source="company.name")

    class Meta:
        model = Problem
        fields = [
            "id",
            "title",
            "problem_type",
            "difficulty",
            "default_time_allowed",
            "company",
            "company_name",
            "is_public",
            "created_at",
        ]


class ProblemDetailSerializer(serializers.ModelSerializer):
    """Detailed problem serializer including test cases and solution"""

    company_name = serializers.ReadOnlyField(source="company.name")
    creator = UserSerializer(source="created_by", read_only=True)

    class Meta:
        model = Problem
        fields = [
            "id",
            "title",
            "description",
            "problem_type",
            "difficulty",
            "default_time_allowed",
            "solution",
            "test_cases",
            "company",
            "company_name",
            "creator",
            "is_public",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "solution": {"write_only": True},  # Only visible to creators and admins
            "hidden_test_cases": {"write_only": True},  # Hidden from candidates
        }


class AssessmentSerializer(serializers.ModelSerializer):
    """Basic assessment serializer"""

    company_name = serializers.ReadOnlyField(source="company.name")
    job_title = serializers.ReadOnlyField(source="job_position.title")

    class Meta:
        model = Assessment
        fields = [
            "id",
            "title",
            "description",
            "company",
            "company_name",
            "job_position",
            "job_title",
            "time_limit",
            "allows_extra_time",
            "allows_breaks",
            "allows_custom_environment",
            "status",
            "created_at",
            "expires_at",
        ]


class AssessmentDetailSerializer(serializers.ModelSerializer):
    """Detailed assessment serializer with problems and candidates"""

    company = CompanySerializer(read_only=True)
    job_position = JobPositionSerializer(read_only=True)
    problems = ProblemSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = [
            "id",
            "title",
            "description",
            "company",
            "job_position",
            "problems",
            "time_limit",
            "allows_extra_time",
            "allows_breaks",
            "allows_custom_environment",
            "status",
            "created_at",
            "expires_at",
        ]


class CandidateAssessmentSerializer(serializers.ModelSerializer):
    """Serializer for candidate assessments"""

    candidate_name = serializers.ReadOnlyField(source="candidate.get_full_name")
    assessment_title = serializers.ReadOnlyField(source="assessment.title")
    company_name = serializers.ReadOnlyField(source="assessment.company.name")

    class Meta:
        model = CandidateAssessment
        fields = [
            "id",
            "candidate",
            "candidate_name",
            "assessment",
            "assessment_title",
            "company_name",
            "status",
            "started_at",
            "completed_at",
            "time_extended",
            "breaks_taken",
            "score",
            "feedback",
            "used_accommodations",
        ]
        read_only_fields = ["started_at", "completed_at", "score", "feedback"]


class SubmissionSerializer(serializers.ModelSerializer):
    """Serializer for problem submissions"""

    candidate_name = serializers.ReadOnlyField(
        source="candidate_assessment.candidate.get_full_name"
    )
    problem_title = serializers.ReadOnlyField(source="problem.title")

    class Meta:
        model = Submission
        fields = [
            "id",
            "candidate_assessment",
            "candidate_name",
            "problem",
            "problem_title",
            "code",
            "language",
            "is_correct",
            "passed_test_cases",
            "total_test_cases",
            "execution_time",
            "memory_used",
            "evaluator_comments",
            "score",
            "created_at",
        ]
        read_only_fields = [
            "is_correct",
            "passed_test_cases",
            "total_test_cases",
            "execution_time",
            "memory_used",
            "evaluator_comments",
            "score",
        ]
