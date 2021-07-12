from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class IsUser(permissions.BasePermission):
    """
    Custom permission to only allow users to edit their own account.
    """
    def has_object_permission(self, request, view, obj):
        return obj == request.user
