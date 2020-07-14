from django.contrib.auth.models import User
from rest_framework import serializers

from organizations.models import Organization
from .models import Profile

class AdminProfileSerializer(serializers.ModelSerializer):
    #organization = serializers.HyperlinkedRelatedField(queryset=Organization.objects.filter(pk=), view_name='organization-detail')
    organization = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all())
    organization_name = serializers.SlugRelatedField(read_only=True, slug_field='name', source='organization')
    class Meta:
        model = Profile
        fields = ['is_admin', 'organization', 'organization_name']

class AdminUserSerializer(serializers.HyperlinkedModelSerializer):
    profile = AdminProfileSerializer()
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()
        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, user, validated_data):
        user.email = validated_data.get('email', user.email)
        user.username = validated_data.get('username', user.username)
        user.set_password(validated_data.get('password'))
        user.save()
        if not hasattr(user, 'profile'): # Return if editing a staff user
            return user
        profile = Profile.objects.get(user=user)
        if 'profile' in validated_data:
            profile_data = validated_data.pop('profile')
            profile.is_admin = profile_data.get('is_admin', profile.is_admin)
            profile.organization = profile_data.get('organization', profile.organization)
        else:
            profile.is_admin = validated_data.get('is_admin', profile.is_admin)
            profile.organization = validated_data.get('organization', profile.organization)
        profile.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    organization = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all())
    organization_name = serializers.SlugRelatedField(read_only=True, source='organization', slug_field='name')

    class Meta:
        model = Profile
        fields = ['is_admin', 'organization', 'organization_name']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(required=False)
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()
        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, user, validated_data):
        user.email = validated_data.get('email', user.email)
        user.username = validated_data.get('username', user.username)
        user.set_password(validated_data.get('password'))
        user.save()
        profile = Profile.objects.get(user=user)
        if 'profile' in validated_data:
            profile_data = validated_data.pop('profile')
            profile.is_admin = profile_data.get('is_admin', profile.is_admin)
            profile.organization = profile_data.get('organization', profile.organization)
        else:
            profile.is_admin = validated_data.get('is_admin', profile.is_admin)
            profile.organization = validated_data.get('organization', profile.organization)
        profile.save()
        return user
