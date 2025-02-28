# users/permissions.py
from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an account or admins to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the user or admin
        return obj == request.user or request.user.is_staff


class IsCompanyAdmin(permissions.BasePermission):
    """
    Custom permission to only allow company admins to perform actions.
    """

    def has_permission(self, request, view):
        # Check if user is authenticated and is a company admin for any company
        return (
                request.user and
                request.user.is_authenticated and
                (request.user.user_type == 'company' or request.user.administered_companies.exists())
        )

    def has_object_permission(self, request, view, obj):
        # Check if user is admin for this specific company
        if hasattr(obj, 'company'):
            # For objects that have a direct company attribute
            return request.user.administered_companies.filter(id=obj.company.id).exists()
        elif hasattr(obj, 'assessment') and hasattr(obj.assessment, 'company'):
            # For objects related to assessments
            return request.user.administered_companies.filter(id=obj.assessment.company.id).exists()
        else:
            # For company objects themselves
            return request.user.administered_companies.filter(id=obj.id).exists()