from django.db import models
from django.utils.timezone import now
import uuid

class Study(models.Model):
    patient = models.ForeignKey('patients.Patient', related_name='studies', on_delete=models.CASCADE)
    created = models.DateTimeField(default=now, editable=False)
    study_instance_uid = models.CharField(max_length=200)
    study_id = models.CharField(max_length=200, blank=True)
    study_date = models.CharField(max_length=100, blank=True)
    report_created = models.DateTimeField(blank=True, null=True)
    report_name = models.CharField(max_length=100, blank=True)
    advanced_report = models.BooleanField(default=False)