from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from organizations.models import Organization
from users.models import Profile

# Create your tests here.


class UserTestCase(APITestCase):
    def setup(self):
        organization1 = Organization(name='name1',
                                    address_line1='address1',
                                    address_line2='',
                                    address_city='city1',
                                    address_state='state1',
                                    address_zip='zip1',
                                    phone='phone1')
        organization1.save()
        organization2 = Organization(name='name2',
                                    address_line1='address2',
                                    address_line2='',
                                    address_city='city2',
                                    address_state='state2',
                                    address_zip='zip2',
                                    phone='phone2')
        organization2.save()
        self.staff = User.objects.create_superuser(username='staff',password='staffPassword', email='staff@email.com')
        self.admin1 = User.objects.create_user(username='admin1', password='adminPassword', email='admin1@email.com')
        user = Profile(user=self.admin1, is_admin=True, organization=organization1)
        user.save()
        self.admin2 = User.objects.create_user(username='admin2', password='adminPassword', email='admin2@email.com')
        user = Profile(user=self.admin2, is_admin=True, organization=organization2)
        user.save()

    def test_create_admin_as_staff(self):
        self.client.login(username='satff', password='staffPassword')
        response = self.client.post('/api/usrs/', {'username':'user1','password':'userPassword','email':'user1@email.com', 'profile':{'is_admin':'true', 'organization':1}})
        assert response.status_code == 201, 'Created'
        assert response.data['username'] == 'user1'
        assert response.data['profile']['is_admin']
        assert response.data['profile']['organization'] == 1

    def test_list_as_staff(self):
        self.client.login(username='satff', password='staffPassword')
        response = self.client.get('/api/usrs/')

        assert len(response.data) == 4

    def test_list_as_admin(self):
        self.client.login(username='admin1', password='adminPassword')
        response = self.client.get('/api/usrs/')

        assert len(response.data) == 2

    def _pre_setup(self):
        self.client = self.client_class()



