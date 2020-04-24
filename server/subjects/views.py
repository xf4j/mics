from rest_framework import viewsets, permissions

from .models import Subject
from organizations.models import Organization
from .serializers import SubjectSerializer

# Create your views here.

class SubjectViewSet(viewsets.ModelViewSet):

    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    