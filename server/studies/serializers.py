from rest_framework import serializers

from patients.models import Patient
# from athletes.serializers import AthleteSerializer
from .models import Study

class StudySerializer(serializers.HyperlinkedModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())

    class Meta:
        model = Study
        fields = ['id', 'study_instance_uid', 'study_id', 'study_date', 'created', 'patient', 'report_created', 'report_name', 'advanced_report']
        read_only_fields = ['report_created', 'report_name', 'advanced_report']
