from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)
    organization = models.ForeignKey('organizations.Organization', on_delete=models.CASCADE)
    