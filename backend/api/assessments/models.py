# assessments/models.py
from api.models import BaseModel
from django.apps import apps
from django.db import models


class Problem(BaseModel):
    """Technical problems for assessment"""

    PROBLEM_TYPE_CHOICES = (
        ("coding", "Coding Problem"),
        ("system_design", "System Design"),
        ("debugging", "Debugging"),
        ("refactoring", "Refactoring"),
    )

    DIFFICULTY_CHOICES = (
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    problem_type = models.CharField(max_length=20, choices=PROBLEM_TYPE_CHOICES)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)

    # Default time allowed in minutes
    default_time_allowed = models.IntegerField(default=60)

    # Sample solution for verification
    solution = models.TextField(blank=True)

    # Test cases as JSON
    test_cases = models.JSONField(default=list)
    hidden_test_cases = models.JSONField(default=list)

    # # Problem creator
    # created_by = models.ForeignKey(
    #     User, on_delete=models.SET_NULL, null=True, related_name="created_problems"
    # )
    # Use string reference for company to avoid circular imports
    company = models.ForeignKey(
        "api.Company",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="company_problems",
    )

    # Is this a public problem or company-specific
    is_public = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Problem"
        verbose_name_plural = "Problems"

    def __str__(self):
        return self.title


class Assessment(BaseModel):
    """Assessment instance assigned to candidates"""

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("evaluated", "Evaluated"),
    )

    # Assessment can be created by a company for a specific position
    # Use string reference for models to avoid circular imports
    company = models.ForeignKey(
        "api.Company", on_delete=models.CASCADE, related_name="company_assessments"
    )
    job_position = models.ForeignKey(
        "api.CompanyJobPosition",
        on_delete=models.SET_NULL,
        null=True,
        related_name="position_assessments",
    )

    # # Assessment can be assigned to multiple candidates
    # candidates = models.ManyToManyField(User, through="CandidateAssessment")

    # Assessment contains multiple problems
    problems = models.ManyToManyField(Problem, related_name="assessments")

    # Assessment settings
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    time_limit = models.IntegerField(help_text="Time limit in minutes")

    # Assessment can be customized for neurodivergent candidates
    allows_extra_time = models.BooleanField(default=True)
    allows_breaks = models.BooleanField(default=True)
    allows_custom_environment = models.BooleanField(default=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Assessment"
        verbose_name_plural = "Assessments"

    def __str__(self):
        # Lazy load Company model to avoid import issues
        Company = apps.get_model("api", "Company")
        company_name = (
            self.company.name
            if isinstance(self.company, Company)
            else "Unknown Company"
        )
        return f"{company_name} - {self.title}"


class CandidateAssessment(BaseModel):
    """Through model for candidates taking assessments"""

    STATUS_CHOICES = (
        ("invited", "Invited"),
        ("started", "Started"),
        ("completed", "Completed"),
        ("expired", "Expired"),
    )

    # candidate = models.ForeignKey(User, on_delete=models.CASCADE)
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)

    # Assessment progress
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="invited")
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # Time extensions for neurodivergent candidates
    time_extended = models.IntegerField(
        default=0, help_text="Additional time in minutes"
    )
    breaks_taken = models.JSONField(default=list, help_text="List of break timestamps")

    # Assessment result
    score = models.FloatField(null=True, blank=True)
    feedback = models.TextField(blank=True)

    # Interview settings used
    used_accommodations = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = "CandidateAssessment"
        verbose_name_plural = "CandidateAssessments"

    def __str__(self):
        # Use name if available, otherwise username
        candidate_name = self.candidate.name or self.candidate.username
        return f"{candidate_name} - {self.assessment.title}"


class Submission(BaseModel):
    """Candidate submission for a problem"""

    candidate_assessment = models.ForeignKey(
        CandidateAssessment, on_delete=models.CASCADE, related_name="submissions"
    )
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)

    # Solution submitted by candidate
    code = models.TextField()
    language = models.CharField(max_length=50)

    # Submission results
    is_correct = models.BooleanField(null=True)
    passed_test_cases = models.IntegerField(default=0)
    total_test_cases = models.IntegerField(default=0)

    # Performance metrics
    execution_time = models.FloatField(null=True, blank=True)
    memory_used = models.FloatField(null=True, blank=True)

    # Evaluation
    evaluator_comments = models.TextField(blank=True)
    score = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Submission"
        verbose_name_plural = "Submissions"

    def __str__(self):
        # Use name if available, otherwise username
        candidate_name = (
            self.candidate_assessment.candidate.name
            or self.candidate_assessment.candidate.username
        )
        return f"{candidate_name} - {self.problem.title}"
