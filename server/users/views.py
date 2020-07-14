from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .serializers import AdminUserSerializer, UserSerializer
from .permissions import IsOrganizationAdminUserOrIsStaffUser
from organizations.models import Organization

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    '''
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    '''
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        '''
        Use different serializer for different user types
        '''
        if self.request.user.is_staff:
            return AdminUserSerializer
        else:
            return UserSerializer

    def get_permissions(self):
        '''
        Instantiates and returns the list of permissions that this view requires.
        '''
        if self.action == 'list' or self.action == 'create' or self.action == 'update' or self.action == 'partial_update' or self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsOrganizationAdminUserOrIsStaffUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not request.user.is_staff:
            organization = request.user.profile.organization
            queryset = queryset.filter(profile__organization=organization)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        if 'profile' in request.data:
            request.data['profile.organization'] = request.data['profile']['organization']
        # if not request.user.is_staff and 'profile.organization' not in request.data:
        #     request.data['profile.organization'] = request.user.profile.organization.id
        #     request.data['profile']['organization'] = request.user.profile.organization.id
        organization = Organization.objects.get(pk=request.data['profile.organization'])
        if not request.user.is_staff and not organization == request.user.profile.organization:
            return Response({'detail': 'You do not have access to this organization.'}, status=status.HTTP_403_FORBIDDEN)
        if not organization:
            return Response({'detail': 'Organization not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(data=request.data, context={'queryset': organization})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def create_staff(self, request, pk=None):
        '''
        Create a new superuser
        '''
        if not request.user.is_staff:
            return Response({'detail': 'You do not have access to this command.'}, status=status.HTTP_403_FORBIDDEN)
        user = User.objects.create_superuser(request.data['username'], request.data['email'], request.data['password'])
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        serializer = self.get_serializer(self.get_object()) # default behavior for retrieve
        if not request.user.is_staff and not request.user.profile.organization.id == serializer.data['profile']['organization']: # check for same organization
            return Response({'detail': 'You do not have access to this organization.'}, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def get_admin(self, request, pk=None):
        '''
        Return user admin status
        '''
        if request.user.is_staff:
            return Response(True)
        return Response(request.user.profile.is_admin)

    @action(detail=False, methods=['get'])
    def get_staff(self, request, pk=None):
        '''
        Return user staff status
        '''
        return Response(request.user.is_staff)