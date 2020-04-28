from rest_framework import permissions

class IsOrganizationAdminUser(permissions.BasePermission):
    '''
    Custom permission to allow organization admins to edit 
    '''

    def has_object_permission(self, request, view, obj):
        attr = getattr(obj, 'profile', None) or getattr(obj, 'organization', None) or obj
        attr = getattr(attr, 'organization', attr)
        if attr is not None:
            return bool(request.user.profile.organization == attr and request.user.profile.is_admin)
        return False

    def has_permission(self, request, view):
        return bool(getattr(request.user, 'profile.is_admin', None))
