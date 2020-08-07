from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from django.db import IntegrityError
from django.utils import timezone
from datetime import datetime
from django.conf import settings
from django.http import HttpResponse
import os, tempfile, io, zipfile

from patients.models import Patient
from .utils import get_backend_dicom_node, upload_dicom_file
from users.permissions import IsOrganizationAdminUserOrIsStaffUser
from imagestudy.models import ImageStudy

class UploadDicomFile(APIView):
    '''
    View to upload a DICOM file
    '''
    permission_class = (permissions.IsAuthenticated, IsOrganizationAdminUserOrIsStaffUser)

    def post(self, request, format=None):
        '''
        Upload a DICOM file to backend DICOM node
        '''
        f = request.data['file']
        fd, temp_path = tempfile.mkstemp()
        with open(temp_path, 'wb') as destination:
            for chunk in f.chunks():
                destination.write(chunk)
        os.close(fd)
        ret = upload_dicom_file(get_backend_dicom_node(), temp_path)
        os.remove(temp_path)
        if ret['status'] == 201:

            patient = Patient.objects.get(pk=request.data['patient'][0])
            if ImageStudy.objects.filter(patient__id=patient.id, image_study_instance_uid=ret['study_instance_uid']).count() == 0:
                try:
                    imagestudy = ImageStudy(patient=patient, image_study_instance_uid=ret['study_instance_uid'], image_study_id=ret['study_id'], image_study_date=ret['study_date'], dicom_patient_id=ret['patient_id'])
                    imagestudy.save()
                except IntegrityError:
                    pass
            # return Response(data=None, status=status.HTTP_201_CREATED)
            #  if entry exists update the entry with new upload time
            else:
            # ImageStudy.objects.filter(patient__id=patient.id, image_study_instance_uid=ret['study_instance_uid']).count() != 0:
                try:
                    timenow=timezone.now()
                    imagestudy=ImageStudy.objects.get(patient__id=patient.id, image_study_instance_uid=ret['study_instance_uid'])
                    imagestudy.created=timenow
                    imagestudy.save()
                except IntegrityError:
                    pass
            return Response(data=None, status=status.HTTP_201_CREATED)

        else:
            return Response({'detail': f.name + ': ' + ret['error']}, status=ret['status'])
