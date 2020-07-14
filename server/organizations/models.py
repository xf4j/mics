from django.db import models

# Create your models here.
class Organization(models.Model):
    name = models.CharField(max_length=200)
    address_line1 = models.CharField(max_length=200)
    address_line2 = models.CharField(max_length=200, blank=True)
    address_city = models.CharField(max_length=100)
    address_state = models.CharField(max_length=100)
    address_zip = models.CharField(max_length=30)
    address_country = models.CharField(max_length=50)
    phone = models.CharField(max_length=100)

    def __str__(self):  
        return self.name