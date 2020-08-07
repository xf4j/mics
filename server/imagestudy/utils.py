from pynetdicom import AE
from pynetdicom.sop_class import StudyRootQueryRetrieveInformationModelFind, StudyRootQueryRetrieveInformationModelMove
from pydicom.dataset import Dataset
import requests
from files.utils import get_resource_id

STUDY_ITEMS = (
    'StudyID',
    'StudyInstanceUID',
    'PatientID',
    'PatientName',
    'PatientSex',
    'PatientAge',
    'PatientBirthDate',
    'StudyDescription',
    'StudyDate',
)

# SERIES_ITEMS is a superset of STUDY_ITEMS
SERIES_ITEMS = (
    'SeriesInstanceUID',
    'SeriesDescription',
    'SeriesDate',
    'SeriesTime',
    'Modality',
)
SERIES_ITEMS = SERIES_ITEMS + STUDY_ITEMS

def retrieve_study_detail(node, study_instance_uid, query={}, retrieve_items=SERIES_ITEMS):
    '''
    Retrieve studies using C-FIND
    Use an empty query {} to retrieve all studies
    '''
    ae = AE()
    # Add a requested presentation context
    ae.add_requested_context(StudyRootQueryRetrieveInformationModelFind)

    ds = Dataset()
    ds.QueryRetrieveLevel = 'SERIES'

    for item in retrieve_items:
        setattr(ds, item, '')

    for key, value in query:
        setattr(ds, key, value)

    setattr(ds, 'StudyInstanceUID', study_instance_uid)
    setattr(ds, 'ReferencedFrameOfReferenceSequence', '')

    assoc = ae.associate(node['address'], node['port'])

    ret = {}
    if assoc.is_established:
        series = []
        # Use the C-FIND service to send the identifier
        # A query_model value of 'P' means use the 'Patient Root Query Retrieve
        #     Information Model - Find' presentation context
        responses = assoc.send_c_find(ds, query_model='S')

        for (status, identifier) in responses:
            # If the status is 'Pending' then `identifier` is the C-FIND response
            if status and status.Status in (0xFF00, 0xFF01):
                series_info = {}
                for item in retrieve_items:
                    series_info[item] = getattr(identifier, item, '')
                rfrs = getattr(identifier, 'ReferencedFrameOfReferenceSequence', '')
                if rfrs != '':
                    rtrss = getattr(rfrs[0], 'RTReferencedStudySequence', '')
                    referenced_study_uid = getattr(rtrss[0], 'ReferencedSOPInstanceUID', '')
                    rtrses = getattr(rtrss[0], 'RTReferencedSeriesSequence', '')
                    referenced_series_uid = getattr(rtrses[0], 'SeriesInstanceUID', '')
                    series_info['ReferencedStudyInstanceUID'] = referenced_study_uid
                    series_info['ReferencedSeriesInstanceUID'] = referenced_series_uid
                else:
                    series_info['ReferencedStudyInstanceUID'] = ''
                    series_info['ReferencedSeriesInstanceUID'] = ''
                series.append(series_info)
        
        # Release the association
        assoc.release()
        if len(series) == 0:
            return {'status': 404, 'error': "Study is empty"}
        else:
            return {'status': 200, 'results': series}
    else:
        return {'status': 500, 'error': "Error retrieving studies"}

def get_study_instance_uids_associated_with_user(user):
    study_instance_uids = []
    for user_study in user.userstudy_set.all():
        study_instance_uids.append(user_study.study_instance_uid)
    return study_instance_uids

def delete_study(node, study_instance_uid):
    resource = get_resource_id(node, study_instance_uid, 'Study')
    base_url = 'http://' + node['address'] + ':' + str(node['http_port'])
    url = base_url + '/studies/' + resource
    auth = (node['http_username'], node['http_password'])
    response = requests.delete(url, auth=auth)
    return response
