from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'password', 'is_admin', 'organization', ]
        extra_kwargs = {'password': {'write_only': True}}



