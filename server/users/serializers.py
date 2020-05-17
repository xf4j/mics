from django.contrib.auth.models import User
from rest_framework import serializers

from organizations.models import Organization
from .models import Profile

class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    organization = serializers.PrimaryKeyRelatedField(queryset = Organization.objects.all())

    class Meta:
        model = Profile
        fields = ('is_admin', 'organization',)

class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(required = False)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):

        if 'profile' in validated_data:
            profile_data = validated_data.pop('profile')
            user = User.objects.create_user(**validated_data)
            Profile.objects.create(user=user, **profile_data)
        else:
            user = User.objects.create_superuser(**validated_data)
        return user

    def update(self, user, validated_data):
        if 'email' in validated_data:
            user.email = validated_data.get('email', user.email)
        if 'username' in validated_data:
            user.username = validated_data.get('username', user.username)
        if 'password' in validated_data:
            user.set_password(validated_data.get('password'))
        user.save()
        if not hasattr(user, 'profile'):
            return user

        profile = Profile.objects.get(user = user)
        if 'profile' in validated_data and validated_data['profile'] is not None:
            profile_data = validated_data.pop('profile')
            profile.is_admin = profile_data.get('is_admin', profile.is_admin)
            profile.organization = profile_data.get('organization', profile.organization)
        else:
            profile.is_admin = validated_data.get('is_admin', profile.is_admin)
            profile.organization = validated_data.get('organization', profile.organization)

        return user

