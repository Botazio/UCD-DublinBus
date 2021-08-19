import json
from django.test import TestCase # ,Client
from dublinbus.models import CustomUser, Stop, Line
from django.db.utils import IntegrityError
from django.utils import timezone


class CustomUserTestCase(TestCase):
    def setUp(self):
        """ CustomUser - Executed before every test case """
        CustomUser.objects.create(username="testuser1", email="testuser1@gmail.com", password="testuser1")

    def tearDown(self):
        """ CustomUser - Executed after every test case """
        print("\n tearDown executing after the test case. Result:")

    def test_customuser(self):
        """CustomUser """
        testuser1 = CustomUser.objects.get(username="testuser1")

        # check defaults have been set
        self.assertEqual(testuser1.date_joined.date(), timezone.now().date())
        self.assertEqual(testuser1.image, 'default.png')
        self.assertEqual(testuser1.map, 'defaultThemeLight')
        self.assertEqual(testuser1.auth_provider, 'email')
        self.assertTrue(testuser1.allow_feedback)

        # check fails when username, email not unique
        with self.assertRaises(IntegrityError):
            CustomUser.objects.create(username="testuser1", email="testuser1@gmail.com", password="testuser1")
            CustomUser.objects.create(username="testuser1", email="testuser1_unique@gmail.com", password="testuser1")

class SignUpTestCase(TestCase):

    def test_login(self):
        """ """
        response = self.client.post('/users/', {"username": "testuser1", "email": "testuser1@gmail.com", "password": "testuser1"})
        self.assertEqual(response.status_code, 201)
        # check that token is returned when sign up

class SignInTestCase(TestCase):
    def setUp(self):
        # create testuser1
        self.client.post('/users/', {"username": "testuser1", "email": "testuser1@gmail.com", "password": "testuser1"})

    def test_login(self):
        """ """
        response = self.client.post('/token-auth/', {"username": "testuser1", "password": "testuser1"})
        # could check response.data, response.content
        self.assertEqual(response.status_code, 200)
        # check that token is returned when sign in

class UserProtectedTestCase(TestCase):
    def setUp(self):
        response = self.client.post('/users/', {"username": "testuser1", "email": "testuser1@gmail.com", "password": "testuser1"})
        self.token = response.data['token']

    def test_users(self):
        """ """
        response = self.client.get('/users/', HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'testuser1')

class DublinBusTests1(TestCase):
    """Class for tests for Dublin Bus app"""
    def setUp(self):
        # doesnt use sqlite db! need to create otherwise get      WARNING  Not Found: /stop/8240DB004747/
        Stop.objects.create(stop_id="8240DB004747", stop_name="Blanchardstown SC, stop 4747", stop_num="4747",
                        stop_lat="53.394333", stop_lon="-6.391852")
        stop = Stop.objects.get(stop_id="8240DB004747")
        Line.objects.create(stop=stop, line="37")
        Line.objects.create(stop=stop, line="39")
        Line.objects.create(stop=stop, line="39a")

    def test_stop(self):
        """"""
        response = self.client.get('/stop/8240DB004747/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['stop_name'], "Blanchardstown SC, stop 4747")
        self.assertEqual(list(json.loads(response.content).keys()), ['stop_name', 'stop_lat', 'stop_lon', 'arrivals'])
        # ['arrivals'] are empty

        # stop does not exist
        response = self.client.get('/stop/8240DB009999/')
        self.assertEqual(response.status_code, 404)

    def test_stops(self):
        """"""
        response = self.client.get('/stops/')
        self.assertEqual(response.status_code, 200)
        res = json.loads(response.content)[0]
        self.assertEqual(res['stop_id'], "8240DB004747")
        self.assertEqual(res['stop_name'], "Blanchardstown SC, stop 4747")
        self.assertEqual(res['stop_num'], 4747)
        self.assertEqual(res['stop_lat'], 53.394333)
        self.assertEqual(res['stop_lon'], -6.391852)
        self.assertEqual(res['stop_lines'], ["37", "39", "39a"])

    def test_lines(self):
        """"""
        response = self.client.get('/lines/')
        # response.content is b'[]'
        self.assertEqual(response.status_code, 200)

