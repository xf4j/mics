from django.db import models
from django.utils.timezone import now
# import uuid

class ImageStudy(models.Model):
    patient = models.ForeignKey('patients.Patient', related_name='imagestudies', on_delete=models.CASCADE)
    created = models.DateTimeField(default=now, editable=False)
    image_study_instance_uid = models.CharField(max_length=200)
    image_study_id = models.CharField(max_length=200, blank=True)
    image_study_date = models.CharField(max_length=100, blank=True)
    dicom_patient_id = models.CharField(max_length=200, blank=True)

class Series(object):
    # Instead of adding all fields, use a dict instead
    def __init__(self, info):
        self.info = info