from rest_framework import serializers
from .models import ViewerSeriesDetail

class ViewerSeriesDetailSerializer(serializers.Serializer):
    series = serializers.DictField(child=serializers.CharField())
    