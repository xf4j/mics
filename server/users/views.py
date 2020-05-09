from rest_framework import viewsets, permissions

from .models import UserProfile
from .serializers import UserProfileSerializer

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer 
    permission_classes = [permissions.IsAuthenticated]
