from django.conf import settings
from pydicom import dcmread
from pynetdicom import AE, StoragePresentationContexts
import requests, os, sys, scipy, vtk
import numpy as np
import scipy.io as sio
from scipy.interpolate import CubicSpline
from scipy.ndimage import gaussian_filter
from skimage.draw import polygon
from skimage.transform import resize
from vtk.util import numpy_support

import requests, urllib
from urllib.parse import urlencode
from requests.auth import HTTPBasicAuth

def get_backend_dicom_node():
    '''
    Return backend info stored in settings.py
    '''
    backend = settings.BACKEND_DICOM_NODE
    return {
        'name': 'backend',
        'aet': backend['AET'],
        'address': backend['ADDRESS'],
        'port': backend['PORT'],
        'http_port': backend['HTTP_PORT'],
        'http_username': backend['HTTP_USERNAME'],
        'http_password': backend['HTTP_PASSWORD']
    }

def upload_dicom_file(node, dcm_file):
    '''
    Upload the received file to the node
    '''
    try:
        ds = dcmread(dcm_file)
    except:
        return {'status': 400, 'error': 'Invalid DICOM file.'} # bad request
    ae = AE()
    ae.requested_contexts = StoragePresentationContexts

    assoc = ae.associate(node['address'], node['port'])
    if assoc.is_established:
        status = assoc.send_c_store(ds)
        assoc.release()
        return {'status': 201, 'study_instance_uid': ds.StudyInstanceUID, 'study_id': ds.StudyID, 'study_date': ds.StudyDate, 'patient_id':ds.PatientID}
    else:
        return {'status': 500, 'error': 'Association with backend DICOM node rejected, aborted, or never connected.'}


def get_wado_uri(node, instance_uid):
    base_url = 'http://' + node['address'] + ':' + str(node['http_port'])
    password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()
    # The actual realm name is "Orthanc Secure Area", but using None is also fine
    password_mgr.add_password(None, base_url, node['http_username'], node['http_password'])

    handler = urllib.request.HTTPBasicAuthHandler(password_mgr)
    opener = urllib.request.build_opener(handler)
    try:
        data = opener.open(base_url + '/wado?objectUID=' + instance_uid + '&&requestType=WADO&&contentType=application/dicom')
        return {'status': 200, 'data': data}
    except urllib.error.HTTPError:
        return {'status': 404, 'error': "Could not find instance"}
    except:
        return {'status': 500, 'error': "Could not retrieve instance"}