from rest_framework import serializers

from .models import Subject
from organizations.models import Organization


class SubjectSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    user_name = serializers.SlugRelatedField(source='user', slug_field='username', read_only=True)
    organization = serializers.SlugRelatedField(queryset=Organization.objects.all(), slug_field='name', required=False)
    organization_id = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all(), required=False)

    class Meta:
        model = Subject
        fields = ('id', 'name', 'organization', )
