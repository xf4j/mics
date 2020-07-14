from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from .models import Patient
from .serializers import PatientSerializer
from users.permissions import IsOrganizationAdminUserOrIsStaffUser
from organizations.models import Organization

# Create your views here.
class StudyViewSet(viewsets.ModelViewSet):
    '''
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    '''
    queryset = Study.objects.all()
    serializer_class = StudySerializer

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
        patient = Patient.objects.get(pk=serializer.data['patient'])
        organization = Organization.objects.get(pk=patient.organization.id)
        if not request.user.is_staff and not request.user.profile.organization.id == organization.id: # check for same organization
            return Response({'detail': 'You do not have access to this organization.'}, status=status.HTTP_403_FORBIDDEN)

        elif not request.user.is_staff and not request.user.profile.is_admin and not request.user.id == patient.user.id:
            return Response({'detail': 'You do not have access to this study.'}, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not request.user.is_staff:
            organization = request.user.profile.organization
            queryset = queryset.filter(patient__organization=organization)
            if not request.user.profile.is_admin:
                queryset = queryset.filter(patient__user=request.user)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        patient = Patient.objects.get(pk=request.data['patient'])
        organization = Organization.objects.filter(pk=patient.organization.id)
        if not request.user.is_staff and not organization[0] == request.user.profile.organization:
            return Response({'detail': 'You do not have access to this organization.'}, status=status.HTTP_403_FORBIDDEN)
        if not organization:
            return Response({'detail': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(data=request.data, context={'queryset': organization})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
