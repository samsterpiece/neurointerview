# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Extended user model with additional fields for neurodivergent profiles"""
    USER_TYPE_CHOICES = (
        ('candidate', 'Candidate'),
        ('company', 'Company'),
        ('admin', 'Admin'),
    )

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='candidate')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    # Neurodivergent profile flags - users can select multiple
    is_adhd = models.BooleanField(default=False)
    is_asd = models.BooleanField(default=False)  # Autism Spectrum
    is_dyslexia = models.BooleanField(default=False)
    is_social_anxiety = models.BooleanField(default=False)

    # User preferences for interview accommodations
    prefers_segmented_sessions = models.BooleanField(default=False)
    prefers_extra_time = models.BooleanField(default=False)
    prefers_text_communication = models.BooleanField(default=False)
    prefers_visual_aids = models.BooleanField(default=False)
    prefers_literal_language = models.BooleanField(default=False)
    prefers_dyslexia_formatting = models.BooleanField(default=False)

    # Custom preferences as JSON
    custom_preferences = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.username


# companies/models.py
from django.db import models
from users.models import User


class Company(models.Model):
    """Company profile model"""
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)

    # Company admin users
    admins = models.ManyToManyField(User, related_name='administered_companies')

    # Company settings
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class CompanyJobPosition(models.Model):
    """Job positions within a company"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='job_positions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    skills_required = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company.name} - {self.title}"


# assessments/models.py
from django.db import models
from users.models import User
from companies.models import Company, CompanyJobPosition


class Problem(models.Model):
    """Technical problems for assessment"""
    PROBLEM_TYPE_CHOICES = (
        ('coding', 'Coding Problem'),
        ('system_design', 'System Design'),
        ('debugging', 'Debugging'),
        ('refactoring', 'Refactoring'),
    )

    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
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

    # Problem creator
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_problems')
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='company_problems')

    # Is this a public problem or company-specific
    is_public = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Assessment(models.Model):
    """Assessment instance assigned to candidates"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('evaluated', 'Evaluated'),
    )

    # Assessment can be created by a company for a specific position
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='company_assessments')
    job_position = models.ForeignKey(CompanyJobPosition, on_delete=models.SET_NULL, null=True,
                                     related_name='position_assessments')

    # Assessment can be assigned to multiple candidates
    candidates = models.ManyToManyField(User, through='CandidateAssessment')

    # Assessment contains multiple problems
    problems = models.ManyToManyField(Problem, related_name='assessments')

    # Assessment settings
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    time_limit = models.IntegerField(help_text="Time limit in minutes")

    # Assessment can be customized for neurodivergent candidates
    allows_extra_time = models.BooleanField(default=True)
    allows_breaks = models.BooleanField(default=True)
    allows_custom_environment = models.BooleanField(default=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.company.name} - {self.title}"


class CandidateAssessment(models.Model):
    """Through model for candidates taking assessments"""
    STATUS_CHOICES = (
        ('invited', 'Invited'),
        ('started', 'Started'),
        ('completed', 'Completed'),
        ('expired', 'Expired'),
    )

    candidate = models.ForeignKey(User, on_delete=models.CASCADE)
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)

    # Assessment progress
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='invited')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # Time extensions for neurodivergent candidates
    time_extended = models.IntegerField(default=0, help_text="Additional time in minutes")
    breaks_taken = models.JSONField(default=list, help_text="List of break timestamps")

    # Assessment result
    score = models.FloatField(null=True, blank=True)
    feedback = models.TextField(blank=True)

    # Interview settings used
    used_accommodations = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.candidate.username} - {self.assessment.title}"


class Submission(models.Model):
    """Candidate submission for a problem"""
    candidate_assessment = models.ForeignKey(CandidateAssessment, on_delete=models.CASCADE, related_name='submissions')
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

    def __str__(self):
        return f"{self.candidate_assessment.candidate.username} - {self.problem.title}"