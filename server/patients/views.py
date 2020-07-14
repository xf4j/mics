from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from .models import Patient
from .serializers import PatientSerializer
from users.permissions import IsOrganizationAdminUserOrIsStaffUser
from organizations.models import Organization

class PatientViewSet(viewsets.ModelViewSet):
    '''
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    '''
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def get_permissions(self):
        '''
        Instantiates and returns the list of permissions that this view requires
        '''
        if self.action == 'retrieve' or self.action == 'list':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOrganizationAdminUserOrIsStaffUser]
        return [permission() for permission in permission_classes]

    def retrieve(self, request, pk=None):
        serializer = self.get_serializer(self.get_object()) # default behavior for retrieve
        if not request.user.is_staff and not request.user.profile.organization.id == serializer.data['organization_id']: # check for same organization
            return Response({'detail': 'You do not have access to this organization.'}, status=status.HTTP_403_FORBIDDEN)
        elif not request.user.is_staff and not request.user.profile.is_admin and not request.user.id == serializer.data['user']:
            return Response({'detail': 'You do not have access to this athlete.'}, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not request.user.is_staff:
            organization = request.user.profile.organization
            queryset = queryset.filter(organization=organization)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        if not request.user.is_staff and 'organization_id' not in request.data:
            organization = Organization.objects.filter(pk=request.user.profile.organization.id)
            request.data['organization_id'] = organization[0].id
        else:
            organization = Organization.objects.filter(pk=request.data['organization_id'])
        if not request.user.is_staff and not organization[0] == request.user.profile.organization:
            return Response({'detail': 'You do not have access to this organization.'}, status=status.HTTP_403_FORBIDDEN)
        if not organization:
            return Response({'detail': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(data=request.data, context={'queryset': organization})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

   