from rest_framework.test import APITestCase
from django.contrib.auth.models import User

from organizations.models import Organization
from .models import Profile

class UsersTestCase(APITestCase):
    def setUp(self):
        organization = Organization(name = 'name',
                                    address_line1 = 'address',
                                    address_line2 = '',
                                    address_city = 'city',
                                    address_state = 'state',
                                    address_zip = 'zip',
                                    address_country = 'us',
                                    phone = 'phone')
        organization.save()

        organization2 = Organization(name='name2',
                                     address_line1='address2',
                                     address_line2='',
                                     address_city='city2',
                                     address_state='state2',
                                     address_zip='zip2',
                                     address_country='us2',
                                     phone='phone2')
        organization2.save()
        self.staff = User.objects.create_superuser('staff', 'staff@email.com', 'staffPassword')

        self.admin = User.objects.create_user('admin', 'admin@omail.com', 'adminPassword')
        user = Profile(user=self.admin, is_admin=True, organization=organization)
        user.save()

        self.user = User.objects.create_user('user', 'user@gmail.com', 'userPassword')
        user = Profile(user=self.user, is_admin=False, organization=organization)
        user.save()

        self.admin2 = User.objects.create_user('admin2', 'admin2@omail2.com', 'admin2Password')
        user = Profile(user=self.admin2, is_admin=True, organization=organization2)
        user.save()
        self.admin3 = User.objects.create_user('admin3', 'admin3@omail3.com', 'admin3Password')
        user = Profile(user=self.admin3, is_admin=True, organization=organization2)
        user.save()

    def tearDown(self):
        self.client.logout()
        self.staff.delete()
        self.admin.delete()
        self.user.delete()
        self.admin2.delete()
        self.admin3.delete()
