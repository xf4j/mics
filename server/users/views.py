from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework  import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from .serializers import UserSerializer
from .permissions import IsOrganizationAdminUser
from organizations.models import Organization

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    # define permission by action
    permission_classes_by_action = {
        'create': (permissions.IsAdminUser|IsOrganizationAdminUser,),
        'destroy': (permissions.IsAdminUser|IsOrganizationAdminUser,),
        'retrieve': (permissions.IsAuthenticated,),
        'list': (permissions.IsAuthenticated,),
        'update': (permissions.IsAuthenticated,),
        'partial_update': (permissions.IsAuthenticated,),
    }

    filter_backends = (DjangoFilterBackend, OrderingFilter,)
    filterset_fields = ['id', 'username']
    ordering_fields = ['id', 'username',]

    def get_permissions(self):
        '''
        user permissions
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

            return [permission() for permission in (permission_classes or self.permission_classes)]

    def list(self, request, *args, **kwargs):
        '''
        Custom list user method
        '''
        queryset = self.filter_queryset(self.get_queryset())

        if not request.user.is_staff:
            #organization = request.user.profile.organization
            queryset = queryset.filter(profile__organization=request.user.profile.organization)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        '''
        Custom retrieve user method
        '''
        serializer = self.get_serializer(self.get_object())
        try:
            organization_id = serializer.data['profile']['organization']
        except TypeError:
            organization_id = None
        if not request.user.is_staff and not request.user.profile.organization.id == organization_id:
            return Response({'detail': 'You do not have access to this organization.'}, status=status.HTTP_403_FORBIDDEN)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        '''
        Custom create user method
        '''
        organization = None
        # formatting request data
        if 'profile' in request.data:
            if request.data['profile'] is not None: 
                request.data['profile.organization'] = request.data['profile']['organization']
                organization =  Organization.objects.get(pk=request.data['profile.organization'])
        
        # permission and non existing exception
        if not request.user.is_staff and not request.user.profile.organization == organization:
            return Response({'detail': 'You do not have access to this organization.'}, status=status.HTTP_403_FORBIDDEN)
        if not organization and 'profile.organization' in request.data:
            return Response({'detail': 'Organization not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data, context={'queryset': organization})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers) 

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

