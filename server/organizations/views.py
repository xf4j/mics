from rest_framework import generics, viewsets
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from .models import Organization
from .serializers import OrganizationSerializer
from users.permissions import IsOrganizationAdminUserOrIsStaffUser

class OrganizationViewSet(viewsets.ModelViewSet):
    '''
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    '''
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def get_permissions(self):
        '''
        Instantiates and returns the list of permissions that this view requires.
        '''
        if self.action == 'retrieve' or self.action == 'list':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'create' or self.action == 'destroy':
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOrganizationAdminUserOrIsStaffUser]

        return [permission() for permission in permission_classes]

    def retrieve(self, request, pk=None):
        serializer = self.get_serializer(self.get_object()) # default behavior for retrieve
        if not request.user.is_staff and not request.user.profile.organization.id == serializer.data['id']:
            return Response({'detail': 'You do not have access to this organization.'}, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not request.user.is_staff:
            queryset = queryset.filter(pk=request.user.profile.organization.id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)