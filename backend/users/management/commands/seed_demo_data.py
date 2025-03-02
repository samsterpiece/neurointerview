# backend/users/management/commands/seed_demo_data.py
import datetime
import random

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from backend.assessments.models import (
    Assessment,
    CandidateAssessment,
    Problem,
    Submission,
)
from backend.companies.models import Company, CompanyJobPosition
from backend.users.models import User


class Command(BaseCommand):
    help = "Seeds the database with demo data for development"

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Seeding demo data..."))

        # Clear existing data (CAREFUL: only use in development!)
        self.clear_data()

        # Create admin user
        admin_user = User.objects.create_superuser(
            username="admin",
            email="admin@neurointerview.com",
            password="adminpassword",
            first_name="Admin",
            last_name="User",
            user_type="admin",
        )
        self.stdout.write(
            self.style.SUCCESS(f"Created admin user: {admin_user.username}")
        )

        # Create company users and companies
        companies = self.create_companies()

        # Create candidate users with different neurodivergent profiles
        candidates = self.create_candidates()

        # Create problems of different types
        problems = self.create_problems(companies)

        # Create assessments
        assessments = self.create_assessments(companies, problems)

        # Assign candidates to assessments
        candidate_assessments = self.assign_candidates_to_assessments(
            candidates, assessments
        )

        # Create some submissions
        self.create_submissions(candidate_assessments, problems)

        self.stdout.write(
            self.style.SUCCESS("Demo data seeding completed successfully!")
        )

    def clear_data(self):
        """Clear existing data (CAREFUL: only use in development!)"""
        self.stdout.write(self.style.WARNING("Clearing existing data..."))

        # Delete in order to respect foreign key constraints
        Submission.objects.all().delete()
        CandidateAssessment.objects.all().delete()
        Assessment.objects.all().delete()
        Problem.objects.all().delete()
        CompanyJobPosition.objects.all().delete()
        Company.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()  # Keep any existing superusers

    def create_companies(self):
        """Create company users and companies"""
        companies = []

        company_data = [
            {
                "name": "TechInnovate",
                "description": "A leading software development company focused on innovation",
                "website": "https://techinnovate.example.com",
                "admin": {
                    "username": "tech_admin",
                    "email": "admin@techinnovate.example.com",
                    "password": "password123",
                    "first_name": "Tech",
                    "last_name": "Admin",
                },
                "positions": [
                    "Senior Frontend Developer",
                    "Backend Engineer",
                    "DevOps Specialist",
                ],
            },
            {
                "name": "DataDynamics",
                "description": "Cutting-edge data science and analytics firm",
                "website": "https://datadynamics.example.com",
                "admin": {
                    "username": "data_admin",
                    "email": "admin@datadynamics.example.com",
                    "password": "password123",
                    "first_name": "Data",
                    "last_name": "Admin",
                },
                "positions": [
                    "Data Scientist",
                    "Machine Learning Engineer",
                    "Data Engineer",
                ],
            },
            {
                "name": "CloudSphere",
                "description": "Cloud infrastructure and platform services",
                "website": "https://cloudsphere.example.com",
                "admin": {
                    "username": "cloud_admin",
                    "email": "admin@cloudsphere.example.com",
                    "password": "password123",
                    "first_name": "Cloud",
                    "last_name": "Admin",
                },
                "positions": [
                    "Cloud Architect",
                    "Full Stack Developer",
                    "Site Reliability Engineer",
                ],
            },
        ]

        for data in company_data:
            # Create company admin user
            admin = User.objects.create_user(
                username=data["admin"]["username"],
                email=data["admin"]["email"],
                password=data["admin"]["password"],
                first_name=data["admin"]["first_name"],
                last_name=data["admin"]["last_name"],
                user_type="company",
            )

            # Create company
            company = Company.objects.create(
                name=data["name"],
                description=data["description"],
                website=data["website"],
            )

            # Add admin to company
            company.admins.add(admin)

            # Create job positions
            for position_title in data["positions"]:
                CompanyJobPosition.objects.create(
                    company=company,
                    title=position_title,
                    description=f"Responsible for {position_title.lower()} tasks in our team.",
                    skills_required=["Python", "JavaScript", "Problem-solving"],
                )

            companies.append(company)
            self.stdout.write(self.style.SUCCESS(f"Created company: {company.name}"))

        return companies

    def create_candidates(self):
        """Create candidate users with different neurodivergent profiles"""
        candidates = []

        candidate_data = [
            {
                "username": "alex_adhd",
                "email": "alex@example.com",
                "password": "password123",
                "first_name": "Alex",
                "last_name": "Johnson",
                "neurodivergent": {
                    "is_adhd": True,
                    "prefers_segmented_sessions": True,
                    "prefers_extra_time": True,
                },
            },
            {
                "username": "sam_asd",
                "email": "sam@example.com",
                "password": "password123",
                "first_name": "Sam",
                "last_name": "Taylor",
                "neurodivergent": {
                    "is_asd": True,
                    "prefers_literal_language": True,
                    "prefers_visual_aids": True,
                },
            },
            {
                "username": "jamie_anxiety",
                "email": "jamie@example.com",
                "password": "password123",
                "first_name": "Jamie",
                "last_name": "Smith",
                "neurodivergent": {
                    "is_social_anxiety": True,
                    "prefers_text_communication": True,
                },
            },
            {
                "username": "morgan_dyslexia",
                "email": "morgan@example.com",
                "password": "password123",
                "first_name": "Morgan",
                "last_name": "Lee",
                "neurodivergent": {
                    "is_dyslexia": True,
                    "prefers_dyslexia_formatting": True,
                    "prefers_extra_time": True,
                },
            },
            {
                "username": "taylor_neurotypical",
                "email": "taylor@example.com",
                "password": "password123",
                "first_name": "Taylor",
                "last_name": "Williams",
                "neurodivergent": {},
            },
        ]

        for data in candidate_data:
            # Create candidate user
            candidate = User.objects.create_user(
                username=data["username"],
                email=data["email"],
                password=data["password"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                user_type="candidate",
            )

            # Set neurodivergent profile settings
            for key, value in data["neurodivergent"].items():
                setattr(candidate, key, value)

            candidate.save()
            candidates.append(candidate)
            self.stdout.write(
                self.style.SUCCESS(f"Created candidate: {candidate.username}")
            )

        return candidates

    def create_problems(self, companies):
        """Create problems of different types"""
        problems = []

        problem_data = [
            {
                "title": "String Reversal",
                "description": """
# String Reversal

Write a function that reverses a string. The input is a string, and the output should be a reversed string.

## Example

Input: "hello"
Output: "olleh"

Input: "Neurointerview"
Output: "weivretniorueN"

## Constraints
- The input string will only contain ASCII characters.
- The maximum length of the input string is 1000 characters.
                """,
                "problem_type": "coding",
                "difficulty": "easy",
                "test_cases": [
                    {"input": '"hello"', "expected_output": '"olleh"'},
                    {
                        "input": '"Neurointerview"',
                        "expected_output": '"weivretniorueN"',
                    },
                    {"input": '"a"', "expected_output": '"a"'},
                ],
                "hidden_test_cases": [
                    {"input": '""', "expected_output": '""'},
                    {"input": '"12345"', "expected_output": '"54321"'},
                ],
                "is_public": True,
            },
            {
                "title": "Data Transformation",
                "description": """
# Data Transformation

Implement a function that transforms an array of user objects into a different format. Each user object in the input array has the properties `id`, `name`, and `email`. Your function should transform this into an object where the keys are the user IDs and the values are objects containing `name` and `email`.

## Example

Input:
```
[
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" }
]
```

Output:
```
{
  "1": { name: "Alice", email: "alice@example.com" },
  "2": { name: "Bob", email: "bob@example.com" }
}
```

## Constraints
- The input array will contain at least one user object.
- All user objects will have id, name, and email properties.
- The id will always be a positive integer.
                """,
                "problem_type": "coding",
                "difficulty": "medium",
                "test_cases": [
                    {
                        "input": '[{ id: 1, name: "Alice", email: "alice@example.com" }, { id: 2, name: "Bob", email: "bob@example.com" }]',
                        "expected_output": '{"1": { name: "Alice", email: "alice@example.com" }, "2": { name: "Bob", email: "bob@example.com" }}',
                    }
                ],
                "hidden_test_cases": [
                    {
                        "input": '[{ id: 5, name: "Charlie", email: "charlie@example.com" }]',
                        "expected_output": '{"5": { name: "Charlie", email: "charlie@example.com" }}',
                    }
                ],
                "is_public": True,
            },
            {
                "title": "Real-Time Chat System Design",
                "description": """
# Real-Time Chat System Design

Design a real-time chat system that allows users to send messages to each other. The system should support both one-on-one and group chats.

## Requirements

1. Users should be able to send messages to other users
2. Users should be able to create and join group chats
3. The system should notify users when new messages arrive
4. Messages should be delivered in real-time
5. The system should support offline message delivery

## Your Task

1. Design the overall architecture of the system
2. Identify the main components and their interactions
3. Explain how you would handle real-time message delivery
4. Describe your data model for storing messages and user information
5. Discuss potential scalability challenges and how you would address them
                """,
                "problem_type": "system_design",
                "difficulty": "hard",
                "default_time_allowed": 90,
                "is_public": True,
            },
            {
                "title": "Fix the Bug in Authentication Service",
                "description": """
# Fix the Bug in Authentication Service

The authentication service below has a bug. Users are reporting that sometimes they remain logged in even after their tokens have expired. Your task is to identify and fix the bug.

```javascript
class AuthService {
  constructor() {
    this.tokens = {};
  }

  login(username, password) {
    // Assume validation happens here
    const token = this.generateToken();
    const expiryTime = Date.now() + 3600000; // 1 hour from now

    this.tokens[username] = {
      token,
      expiryTime
    };

    return { token, expiryTime };
  }

  isLoggedIn(username, token) {
    const userToken = this.tokens[username];

    if (!userToken) {
      return false;
    }

    if (userToken.token !== token) {
      return false;
    }

    // Check if token has expired
    if (userToken.expiryTime < Date.now()) {
      // Token has expired
      this.tokens[username] = null;
      return false;
    }

    return true;
  }

  logout(username) {
    this.tokens[username] = null;
  }

  generateToken() {
    // Simplified token generation
    return Math.random().toString(36).substr(2);
  }
}
```

## Your Task

1. Identify the bug in the authentication service
2. Fix the code to ensure users are properly logged out when their tokens expire
3. Explain your reasoning
                """,
                "problem_type": "debugging",
                "difficulty": "medium",
                "default_time_allowed": 45,
                "is_public": False,
            },
        ]

        for idx, data in enumerate(problem_data):
            # Assign some problems to specific companies
            company = None
            if idx % 2 == 0 and companies:
                company = companies[idx % len(companies)]

            problem = Problem.objects.create(
                title=data["title"],
                description=data["description"],
                problem_type=data["problem_type"],
                difficulty=data["difficulty"],
                default_time_allowed=data.get("default_time_allowed", 60),
                company=company,
                is_public=data["is_public"],
                created_by=company.admins.first() if company else None,
                test_cases=data.get("test_cases", []),
                hidden_test_cases=data.get("hidden_test_cases", []),
            )

            problems.append(problem)
            self.stdout.write(self.style.SUCCESS(f"Created problem: {problem.title}"))

        return problems

    def create_assessments(self, companies, problems):
        """Create assessments linked to companies and problems"""
        assessments = []

        for company in companies:
            # Create 1-2 assessments per company
            for i in range(random.randint(1, 2)):
                job_position = company.job_positions.order_by("?").first()

                assessment = Assessment.objects.create(
                    company=company,
                    job_position=job_position,
                    title=f"{job_position.title} Assessment",
                    description=f"Technical assessment for the {job_position.title} position at {company.name}",
                    time_limit=60,  # 60 minutes
                    allows_extra_time=True,
                    allows_breaks=True,
                    allows_custom_environment=True,
                    status="pending",
                )

                # Add 2-3 random problems to the assessment
                selected_problems = random.sample(
                    list(problems), min(random.randint(2, 3), len(problems))
                )
                assessment.problems.add(*selected_problems)

                assessments.append(assessment)
                self.stdout.write(
                    self.style.SUCCESS(f"Created assessment: {assessment.title}")
                )

        return assessments

    def assign_candidates_to_assessments(self, candidates, assessments):
        """Assign candidates to assessments with different statuses"""
        candidate_assessments = []

        for assessment in assessments:
            # Assign 2-3 random candidates to each assessment
            selected_candidates = random.sample(
                candidates, min(random.randint(2, 3), len(candidates))
            )

            for candidate in selected_candidates:
                # Create a candidate assessment with a random status
                status = random.choice(["invited", "started", "completed", "expired"])

                candidate_assessment = CandidateAssessment.objects.create(
                    candidate=candidate, assessment=assessment, status=status
                )

                # Set realistic timestamps based on status
                now = timezone.now()

                if status in ["started", "completed", "expired"]:
                    # Started sometime in the last week
                    started_at = now - datetime.timedelta(
                        days=random.randint(1, 7), hours=random.randint(0, 23)
                    )
                    candidate_assessment.started_at = started_at

                if status in ["completed", "expired"]:
                    # Completed after starting
                    completed_at = candidate_assessment.started_at + datetime.timedelta(
                        minutes=random.randint(30, 90)
                    )
                    candidate_assessment.completed_at = completed_at

                    # Add a score for completed assessments
                    if status == "completed":
                        candidate_assessment.score = random.uniform(60.0, 100.0)
                        candidate_assessment.feedback = "Good work on the technical problems. Demonstrated solid understanding of core concepts."

                # Record accommodations used for some assessments
                if (
                    candidate.is_adhd
                    or candidate.is_asd
                    or candidate.is_social_anxiety
                    or candidate.is_dyslexia
                ):
                    accomm = {}

                    if candidate.prefers_extra_time:
                        time_extended = random.randint(10, 30)
                        candidate_assessment.time_extended = time_extended
                        accomm["extended_time"] = f"{time_extended} minutes"

                    if candidate.prefers_segmented_sessions and random.choice(
                        [True, False]
                    ):
                        accomm["sessions"] = "Took multiple breaks"

                    if candidate.prefers_visual_aids and random.choice([True, False]):
                        accomm["visual_aids"] = "Used diagram mode"

                    candidate_assessment.used_accommodations = accomm

                candidate_assessment.save()
                candidate_assessments.append(candidate_assessment)
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Assigned {candidate.username} to assessment {assessment.title} with status {status}"
                    )
                )

        return candidate_assessments

    def create_submissions(self, candidate_assessments, problems):
        """Create some submissions for completed assessments"""
        submissions = []

        # Only create submissions for started or completed assessments
        for ca in candidate_assessments:
            if ca.status not in ["started", "completed"]:
                continue

            # Get problems from the assessment
            assessment_problems = ca.assessment.problems.all()

            for problem in assessment_problems:
                # Random chance to have submitted a solution
                if random.choice([True, False, True]):  # 2/3 chance of submission
                    # Pick a language
                    language = random.choice(["javascript", "python", "java"])

                    # Generate some dummy code
                    if language == "javascript":
                        code = """function solution(input) {
  // Implementation here
  return input.split('').reverse().join('');
}"""
                    elif language == "python":
                        code = """def solution(input):
    # Implementation here
    return input[::-1]"""
                    else:  # java
                        code = """public class Solution {
  public static String solution(String input) {
    // Implementation here
    return new StringBuilder(input).reverse().toString();
  }
}"""

                    # Determine if it was correct (more likely for completed assessments)
                    is_correct = ca.status == "completed" and random.random() > 0.3

                    # Create submission
                    total_tests = len(problem.test_cases) + len(
                        problem.hidden_test_cases
                    )
                    passed_tests = (
                        total_tests
                        if is_correct
                        else random.randint(0, total_tests - 1)
                    )

                    submission = Submission.objects.create(
                        candidate_assessment=ca,
                        problem=problem,
                        code=code,
                        language=language,
                        is_correct=is_correct,
                        passed_test_cases=passed_tests,
                        total_test_cases=total_tests,
                        score=(
                            100.0 * (passed_tests / total_tests)
                            if total_tests > 0
                            else 0
                        ),
                    )

                    submissions.append(submission)
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Created submission for {ca.candidate.username} on problem {problem.title}"
                        )
                    )

        return submissions
