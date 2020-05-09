from django.db import models

# Create your models here.
class Organization(models.Model):
    name = models.CharField('organization name', max_length=200)
    address_line1 = models.CharField('address line 1', max_length=200)
    address_line2 = models.CharField('address line 2', max_length=200, blank=True)
    address_city = models.CharField('address city', max_length=100)
    address_state = models.CharField('address state', max_length=100)
    address_zip = models.CharField('address zip', max_length=30)
    address_country = models.CharField('address country', max_length=50)
    phone = models.CharField('organization phone', max_length=100)

    def __str__(self):
        return self.name