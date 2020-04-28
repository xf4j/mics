from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status

from .models import Organization
from .serializers import OrganizationSerializer
from users.permissions import IsOrganizationAdminUser

# Create your views here.
class OrganizationViewSet(viewsets.ModelViewSet):
    
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    permission_classes_by_action = {
        'retrieve': (permissions.IsAuthenticated,),
        'list': (permissions.IsAuthenticated,),
        'create': (permissions.IsAdminUser,),
        'destroy': (permissions.IsAdminUser,),
        'update': (permissions.IsAdminUser|IsOrganizationAdminUser,),
        'partial_update': (permissions.IsAdminUser|IsOrganizationAdminUser,),
    }
    
    def get_permissions(self):
        '''
        permissions class setting

        '''
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            if self.action:
                action_func = getattr(self, self.action, {})
                action_func_kwargs = getattr(action_func, 'kwargs', {})
                permission_classes = action_func_kwargs.get('permission_classes')
            else:
                permission_classes = None
                
            return [permission() for permission in (self.permission_classes or permission_classes)]
    
    def retrieve(self, request, pk=None):
        serializer = self.get_serializer(self.get_object())
        if not request.user.is_staff and not request.user.profile.organization.id == serializer.data['id']:
            return Response({'detail': 'You do not have access to this organization.'}, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not request.user.is_staff:
            queryset = queryset.filter(pk=request.user.profile.organization.id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    