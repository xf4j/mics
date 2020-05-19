from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User

# Create your models here.
class Subject(models.Model):
    name = models.CharField(_('name'), max_length=50)
    organization = models.ForeignKey('organizations.Organization', on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return '{}'.format(self.name)
    