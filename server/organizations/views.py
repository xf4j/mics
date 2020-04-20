from rest_framework import viewsets, permissions

from .models import Organization
from .serializers import OrganizationSerializer

# Create your views here.
class OrganizationViewSet(viewsets.ModelViewSet):
    
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
