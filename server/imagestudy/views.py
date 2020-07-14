from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.http import FileResponse, HttpResponse
from django.conf import settings
from django.shortcuts import redirect
import os, zipfile
from django.contrib.auth.models import User
from .models import ImageStudy, Series
from .serializers import ImageStudySerializer, StudySeriesSerializer
# from .utils import delete_orthanc_study
from patients.models import Patient
from organizations.models import Organization
from users.permissions import IsOrganizationAdminUserOrIsStaffUser
# from files.utils import ROI_NAMES
from files.utils import get_backend_dicom_node
from .utils import retrieve_study_detail

class ImageStudyViewSet(viewsets.ModelViewSet):
    '''
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    '''
    queryset = ImageStudy.objects.all()
    serializer_class = ImageStudySerializer

    def get_permissions(self):
        '''
        Instantiates and returns the list of permissions that this view requires
        '''
        if self.action == 'retrieve' or self.action == 'list':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOrganizationAdminUserOrIsStaffUser]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not request.user.is_staff:
            organization = request.user.profile.organization
            queryset = queryset.filter(patient__organization=organization)
            
            # if not request.user.profile.is_admin:
            #     queryset = queryset.filter(athlete__user=request.user)

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

    def retrieve(self, request, pk=None):
        serializer = self.get_serializer(self.get_object()) # default behavior for retrieve
        patient = Patient.objects.get(pk=serializer.data['patient'])
        organization = Organization.objects.get(pk=patient.organization.id)
        if not request.user.is_staff and not request.user.profile.organization.id == organization.id: # check for same organization
            return Response({'detail': 'You do not have access to this organization.'}, status=status.HTTP_403_FORBIDDEN)

        # elif not request.user.is_staff and not request.user.profile.is_admin and not request.user.id == patient.user.id:
        #     return Response({'detail': 'You do not have access to this study.'}, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ImageStudyDetail(APIView):
    '''
    View to access the detail of one study.
    '''
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, uid, format=None):
        '''
        Return the detail of given study.
        '''
        node=get_backend_dicom_node()
        ret = retrieve_study_detail(get_backend_dicom_node(), uid)
        if ret['status'] == 200:
            series = []
            user = User.objects.get(username=request.user)
            if user.is_staff:
                for info in ret['results']:
                    series.append(Series(info=info))
            else:
                study_instance_uids_request = get_study_instance_uids_associated_with_user(user)
                for info in ret['results']:
                    if info['StudyInstanceUID'] in study_instance_uids_request:
                        series.append(Series(info=info))
            if len(series) == 0:
                return Response(data={'non_field_errors': [uid + ': User is not authorized to view this study']}, status=status.HTTP_403_FORBIDDEN)
            serializer = StudySeriesSerializer(series, many=True)
            return Response(data=serializer.data, status=ret['status'])
        else:
            return Response(data={'non_field_errors': [uid + ': ' + ret['error']]}, status=ret['status'])

    