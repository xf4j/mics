from rest_framework import serializers

from .models import Organization

class OrganizationSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Organization
        fields = ['id', 'name', 'address_line1', 'address_line2', 'address_city', 'address_state', 'address_zip', 'address_country', 'phone']