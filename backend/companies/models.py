# companies/models.py
from django.db import models

from backend.api.models import BaseModel
from backend.users.models import User


class Company(BaseModel):
    """Company profile model"""

    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to="company_logos/", null=True, blank=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)

    # Company admin users
    admins = models.ManyToManyField(User, related_name="administered_companies")

    # Company settings
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Company"
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.name


class CompanyJobPosition(BaseModel):
    """Job positions within a company"""

    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="job_positions"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    skills_required = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Company Job Position "
        verbose_name_plural = "Company Job Positions"

    def __str__(self):
        return f"{self.company.name} - {self.title}"
