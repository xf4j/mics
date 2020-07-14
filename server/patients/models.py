from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    name = models.CharField(max_length=50)
    age = models.DecimalField(max_digits=5, decimal_places=0, blank=True)
    dob = models.DateField(blank=True)
    sex = models.CharField(max_length=1, blank=True)
    organization = models.ForeignKey('organizations.Organization', on_delete=models.CASCADE)
    # user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

#         INSERT INTO patients_patients (name,age,dob,sex,organization_id)
#    ...> Values("P_A",25,10.10.1995,"F",1);