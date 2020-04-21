from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_admin = models.BooleanField(_('check admin'), default=False)
    organization = models.ForeignKey('organizations.Organization', on_delete=models.CASCADE)
