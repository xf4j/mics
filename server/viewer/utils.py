from pynetdicom import AE
from pynetdicom.sop_class import StudyRootQueryRetrieveInformationModelFind
from pydicom import dcmread
from pydicom.dataset import Dataset
from pydicom.filebase import DicomBytesIO
import email
from imagestudy.utils import SERIES_ITEMS
# from dicom_nodes.utils import get_wado_rs

INHOUSE_KEYWORD = 'CarinaAI'

def check_series_exist(node, series_instance_uid):
    '''
    Check if the node contains the series
    '''
    print("Inside check series exist",series_instance_uid)
    # Initialise the Application Entity
    ae = AE()
    # Add a requested presentation context
    ae.add_requested_context(StudyRootQueryRetrieveInformationModelFind)

    # Create our Identifier (query) dataset
    ds = Dataset()
    ds.QueryRetrieveLevel = 'SERIES'
    setattr(ds, 'SeriesInstanceUID', series_instance_uid)
    setattr(ds, 'StudyInstanceUID', '')
    study_instance_uid = ''

    # Associate with peer AE(node)
    assoc = ae.associate(node['address'], node['port'])
    if assoc.is_established:
        # Use the C-FIND service to send the identifier
        responses = assoc.send_c_find(ds, query_model='S')
        # print("Responses =",responses)
        for (status, identifier) in responses:
            # print("status", status)
            # print("identifier", identifier)
            if status and status.Status in (0xFF00, 0xFF01):
                study_instance_uid = getattr(identifier, 'StudyInstanceUID', '')
                # print("study Insta UID", study_instance_uid)
        
        # Release the association
        assoc.release()
        if study_instance_uid == '':
            return {'status_code': 404, 'error': 'Series not found, invalid series instance uid'}
        else:
            return {'status_code': 200}
    else:
        return {'status_code': 500, 'error': 'Error connecting backend DICOM node'}


def retrieve_viewer_series_detail(node, series_instance_uid):
    '''
    Retrieve viewer series detail
    '''
    ae = AE()
    # Add a requested presentation context
    ae.add_requested_context(StudyRootQueryRetrieveInformationModelFind)

    detail = {}

    #### First get the instance uid of the series
    assoc = ae.associate(node['address'], node['port'])
    ds = Dataset()
    ds.QueryRetrieveLevel = 'SERIES'
    setattr(ds, 'SeriesInstanceUID', series_instance_uid)
    setattr(ds, 'StudyInstanceUID', '')
    study_instance_uid = ''
    
    if assoc.is_established:
        responses = assoc.send_c_find(ds, query_model='S')

        for (status, identifier) in responses:
            if status and status.Status in (0xFF00, 0xFF01):
                study_instance_uid = getattr(identifier, 'StudyInstanceUID', '')

        assoc.release()
        if study_instance_uid == '':
            return {'status_code': 404, 'error': "Series not found, invalid series instance uid"}
    else:
        return {'status_code': 500, 'error': "Error connecting backend DICOM node"}

    ##### Then get all series within this study and find all automatic segmentation series
    assoc = ae.associate(node['address'], node['port'])
    ds = Dataset()
    ds.QueryRetrieveLevel = 'SERIES'
    for item in SERIES_ITEMS:
        setattr(ds, item, '')
    setattr(ds, 'ReferencedFrameOfReferenceSequence', '')
    setattr(ds, 'StudyInstanceUID', study_instance_uid)
    
    series = []
    if assoc.is_established:
        responses = assoc.send_c_find(ds, query_model='S')

        for (status, identifier) in responses:
            if status and status.Status in (0xFF00, 0xFF01):
                series_info = {}
                for item in SERIES_ITEMS:
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

        assoc.release()

        if len(series) == 0:
            return {'status_code': 404, 'error': "Series not found"}
        else:
            for s in series:
                if s['SeriesInstanceUID'] == series_instance_uid:
                    ret_series = s
        
    else:
        return {'status_code': 500, 'error': "Error connecting the server"}

    
    #### Finally get all instance uids within the imaging series
    assoc = ae.associate(node['address'], node['port'])
    ds = Dataset()
    ds.QueryRetrieveLevel = 'INSTANCE'
    setattr(ds, 'SOPInstanceUID', '')
    setattr(ds, 'SeriesInstanceUID', series_instance_uid)
    instance_uids = ''

    if assoc.is_established:
        responses = assoc.send_c_find(ds, query_model='S')

        for (status, identifier) in responses:
            if status and status.Status in (0xFF00, 0xFF01):
                sop_instance_uid = getattr(identifier, 'SOPInstanceUID', '')
                instance_uids += sop_instance_uid + ';'

        assoc.release()

        # Remove the trailing ;
        instance_uids = instance_uids.rstrip(';')

        if instance_uids == '':
            return {'status_code': 404, 'error': "Instance UIDs not found"}
        else:
            ret_series['instance_uids'] = instance_uids
            detail['series'] = ret_series

    return {'status_code': 200, 'results': detail}
