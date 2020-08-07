from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.http import HttpResponse

from files.utils import get_backend_dicom_node, get_wado_uri
from .utils import check_series_exist, retrieve_viewer_series_detail
from .serializers import ViewerSeriesDetailSerializer
from .models import ViewerSeriesDetail
# Create your views here.
@api_view()  # by default only GET methods will be accepted
@permission_classes([IsAuthenticated])
def series_instance_uid_valid(request, series_instance_uid):
    '''
    Check whether the given series instance uid is valid. 
    Return 'valid' if this series can be found in backend DICOM node. 
    Return HTTP error if can't be found.
    '''
    ret = check_series_exist(get_backend_dicom_node(), series_instance_uid)
    if ret['status_code'] == 200:
        return Response(data='valid', status=status.HTTP_200_OK)
    elif ret['status_code'] == 404:
        return Response(data={'non_field_errors': [series_instance_uid + ': ' + ret['error']]}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(data={'non_field_errors': [series_instance_uid + ': ' + ret['error']]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ViewerSeriesDetail(APIView):
    '''
    View to the detail of series for viewer.
    '''
    permission_classes = (IsAuthenticated,)

    def get(self, request, series_instance_uid, format=None):
        '''
        Return series detail for the use of viewer, including image series, segmentation series and segmentation contours.
        '''
        ret = retrieve_viewer_series_detail(get_backend_dicom_node(), series_instance_uid)
        if ret['status_code'] == 200:
            r = ret['results']
            detail = ViewerSeriesDetail(series=r['series'])
            serializer = ViewerSeriesDetailSerializer(detail)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(data={'non_field_errors': [series_instance_uid + ': ' + ret['error']]}, status=ret['status_code'])

class ViewerInstance(APIView):
    '''
    View to get the DICOM instance.
    '''
    permission_classes = (IsAuthenticated,)

    def get(self, request, sop_instance_uid, format=None):
        '''
        Return requested instance from backend DICOM node.
        '''
        answer = get_wado_uri(get_backend_dicom_node(), sop_instance_uid)
        if answer['status'] != 200:
            return HttpResponse(content=None, status=answer['status'], content_type='application/json')
        else:
            return HttpResponse(content=answer['data'], status=answer['status'], content_type='application/dicom')
