from rest_framework import serializers

from patients.models import Patient
# from athletes.serializers import AthleteSerializer
from .models import ImageStudy

class ImageStudySerializer(serializers.HyperlinkedModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())

    class Meta:
        model = ImageStudy
        fields = ['id', 'image_study_instance_uid', 'image_study_id', 'image_study_date', 'created', 'patient', 'dicom_patient_id']
        
class StudySeriesSerializer(serializers.Serializer):
    info = serializers.DictField(child=serializers.CharField())