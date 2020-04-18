from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, user, validated_data):
        user.email = validated_data.get('email', user.email)
        user.username = validated_data.get('username', user.username)
        user.set_password(validated_data.get('password'))
        user.save()
        return user

