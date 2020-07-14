from rest_framework import permissions

class IsOrganizationAdminUserOrIsStaffUser(permissions.BasePermission):
    '''
    Custom permission to only allow organization admins or system staff admins to edit it.
    '''
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        # Check for the organization to match
        attr = getattr(obj, 'profile', None) or getattr(obj, 'organization', None) or getattr(obj, 'athlete', None) or obj
        attr = getattr(attr, 'organization', attr)
        if attr is not None:
            return bool(request.user.profile.organization == attr and request.user.profile.is_admin)
        return False

    def has_permission(self, request, view):
        return bool(request.user.is_staff or request.user.profile.is_admin)

class IsStaffUserOrOrganizationViewOnly(permissions.BasePermission):
    '''
    Custom permission to only allow staff members to edit
    '''
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff
    
    def has_permission(self, request, view):
        if request.user.is_staff or request.user.profile.is_admin:
            return True
        if view.action == 'retrieve':
            obj = view.queryset[0] # retrieve action only has one obj in its queryset

            # Check for the organization to match
            attr = getattr(obj, 'profile', None) or getattr(obj, 'organization', None) or getattr(obj, 'athlete', None) or obj
            attr = getattr(attr, 'organization', attr)
            if attr is not None:
                return bool(request.user.profile.organization == attr)
        return False

class IsOrganizationAdminUserOrIsStaffUserOrIsAthlete(permissions.BasePermission):
    '''
    Custom permission to allow staff and organization admins to edit and allows athlete users to view their info
    '''
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        # Check for the organization to match
        attr = getattr(obj, 'profile', None) or getattr(obj, 'organization', None) or getattr(obj, 'athlete', None) or obj
        attr = getattr(attr, 'organization', attr)
        if attr is not None:
            return bool(request.user.profile.organization == attr and request.user.profile.is_admin)
        return False

    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        if view.action == 'retrieve':
            obj = view.queryset[0] # retrieve action only has one obj in its queryset

            # Check for the organization to match
            attr = getattr(obj, 'profile', None) or getattr(obj, 'organization', None) or getattr(obj, 'athlete', None) or obj
            attr = getattr(attr, 'organization', attr)
            if attr is not None:
                return bool(request.user.profile.organization == attr)
        return False
