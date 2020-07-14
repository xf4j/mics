from rest_framework import serializers
from django.contrib.auth.models import User

from organizations.models import Organization
from .models import Patient

from studies.serializers import StudySerializer

class PatientSerializer(serializers.HyperlinkedModelSerializer):
    organization = serializers.SlugRelatedField(queryset=Organization.objects.all(), slug_field='name', required=False)
    organization_id = serializers.PrimaryKeyRelatedField(source='organization', queryset=Organization.objects.all(), required=False)
    # user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, required=False)
    # user_name = serializers.SlugRelatedField(source='user', slug_field='username', read_only=True)
    # studies = StudySerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'name', 'age', 'dob','sex' , 'organization', 'organization_id']
        # fields = ['id', 'name', 'age', 'dob','sex' , 'organization', 'organization_id', 'studies']