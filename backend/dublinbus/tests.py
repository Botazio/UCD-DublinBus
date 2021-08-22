import json
from django.utils import timezone
from django.test import TestCase # , Client
from django.db.utils import IntegrityError
from django.urls import reverse
from model_bakery import baker
from tastypie.test import ResourceTestCaseMixin
from dublinbus.models import Stop, Shape, Route, Calendar, Trip, StopTime, Line, \
    CustomUser, FavoriteStop, FavoriteJourney, FavoriteLine, FeedbackQuestion, FeedbackAnswer, \
    Theme, Marker

# Testing models.py
class ModelsBakerTestCase(TestCase):
    'ModelsBakerTestCase'
    def test_stop(self):
        'test_stop'
        obj = baker.make(Stop)
        self.assertTrue(isinstance(obj, Stop))
        self.assertEqual(obj.__str__(), obj.stop_name)

    def test_shape(self):
        'test_shape'
        obj = baker.make(Shape)
        self.assertTrue(isinstance(obj, Shape))
        self.assertEqual(obj.__str__(), obj.shape_id)

    def test_route(self):
        'test_route'
        obj = baker.make(Route)
        self.assertTrue(isinstance(obj, Route))
        self.assertEqual(obj.__str__(), obj.route_id)

    def test_calendar(self):
        'test_calendar'
        obj = baker.make(Calendar)
        self.assertTrue(isinstance(obj, Calendar))
        self.assertEqual(obj.__str__(), obj.service_id)

    def test_trip(self):
        'test_trip'
        obj = baker.make(Trip)
        self.assertTrue(isinstance(obj, Trip))
        self.assertEqual(obj.__str__(), obj.trip_id)

    def test_stoptime(self):
        'test_stoptime'
        obj = baker.make(StopTime)
        self.assertTrue(isinstance(obj, StopTime))
        self.assertEqual(obj.__str__(), obj.trip_id + ' - ' + str(obj.stop))

    def test_line(self):
        'test_line'
        obj = baker.make(Line)
        self.assertTrue(isinstance(obj, Line))
        self.assertEqual(obj.__str__(), str(obj.stop))

    def test_custom_user(self):
        'test_custom_user'
        obj = baker.make(CustomUser)
        self.assertTrue(isinstance(obj, CustomUser))
        self.assertEqual(obj.__str__(), obj.email)

    def test_favoritestop(self):
        'test_favoritestop'
        obj = baker.make(FavoriteStop)
        self.assertTrue(isinstance(obj, FavoriteStop))
        self.assertEqual(obj.__str__(), str(obj.owner) + ' - ' + str(obj.stop_id))

    def test_favoritejourney(self):
        'test_favoritejourney'
        obj = baker.make(FavoriteJourney)
        self.assertTrue(isinstance(obj, FavoriteJourney))
        self.assertEqual(obj.__str__(), str(obj.owner) + ' - ' +\
                                           str(obj.stop_origin) + ' -> ' +\
                                           str(obj.stop_destination))

    def test_favoriteline(self):
        'test_favoriteline'
        obj = baker.make(FavoriteLine)
        self.assertTrue(isinstance(obj, FavoriteLine))
        self.assertEqual(obj.__str__(), str(obj.owner) + ' - ' +\
                                           str(obj.route_short_name) + ' - ' +\
                                           str(obj.direction_id))

    def test_feedbackquestion(self):
        'test_feedbackquestion'
        obj = baker.make(FeedbackQuestion)
        self.assertTrue(isinstance(obj, FeedbackQuestion))
        self.assertEqual(obj.__str__(), str(obj.question_number) + ': ' +\
                                           str(obj.question_text))

    def test_feedbackanswer(self):
        'test_feedbackanswer'
        obj = baker.make(FeedbackAnswer)
        self.assertTrue(isinstance(obj, FeedbackAnswer))
        self.assertEqual(obj.__str__(), str(obj.question) + ' [rating]' +\
                                           str(obj.rating) + ' [text] ' +\
                                           str(obj.text))

    def test_theme(self):
        'test_theme'
        obj = baker.make(Theme)
        self.assertTrue(isinstance(obj, Theme))
        self.assertEqual(obj.__str__(), str(obj.owner.username))

    def test_marker(self):
        'test_marker'
        obj = baker.make(Marker)
        self.assertTrue(isinstance(obj, Marker))
        self.assertEqual(obj.__str__(), str(obj.owner.username))

# testing models manually hardcoded values (not using baker)
class CustomUserTestCase(TestCase):
    'CustomUserTestCase'

    def setUp(self):
        'setUp'
        CustomUser.objects.create(username="testuser1"
                                  ,email="testuser1@gmail.com"
                                  ,password="testuser1")

    def test_customuser(self):
        'test_customuser'
        testuser1 = CustomUser.objects.get(username="testuser1")

        # check defaults have been set
        self.assertEqual(testuser1.date_joined.date(), timezone.now().date())
        self.assertEqual(testuser1.image, 'default.png')
        self.assertEqual(testuser1.map, 'defaultThemeLight')
        self.assertEqual(testuser1.auth_provider, 'email')
        self.assertTrue(testuser1.allow_feedback)

        # check fails when username, email not unique
        with self.assertRaises(IntegrityError):
            CustomUser.objects.create(username="testuser1"
                                      ,email="testuser1@gmail.com"
                                      ,password="testuser1")
            CustomUser.objects.create(username="testuser1"
                                      ,email="testuser1_unique@gmail.com"
                                      ,password="testuser1")

# Testing views.py
class CustomUserSignUpTestCase(TestCase):
    'CustomUserSignUpTestCase'

    def test_user_sign_up(self):
        'test_user_sign_up'
        # missing username, password, email
        response = self.client.post('/users/',)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"username":["This field is required."],
                          "password":["This field is required."],
                          "email":["This field is required."]})

        # missing username
        response = self.client.post('/users/',
                                    {"email": "testuser1@gmail.com",
                                     "password": "testuser1"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'username': ['This field is required.']})

        # missing email
        response = self.client.post('/users/', {"username": "testuser1", "password": "testuser1"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'email': ['This field is required.']})
        # invalid email
        response = self.client.post('/users/', {"username": "testuser1",
                                     "email": "testuser1gmail.com",
                                     "password": "testuser1"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'email': ['Enter a valid email address.']})

        # missing password
        response = self.client.post('/users/'
                                    , {"username": "testuser1", "email": "testuser1@gmail.com"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'password': ['This field is required.']})

        # successful sign up of superuser with email
        response = self.client.post('/users/',
                                    {"username": "superuser1",
                                     "email": "superuser1@gmail.com",
                                     "password": "superuser1",
                                     "is_staff": "True",
                                     "is_superuser": "True"})
        self.assertEqual(response.status_code, 201)

        # successful sign up of standarduser with email
        response = self.client.post('/users/',
                                    {"username": "testuser1",
                                     "email": "testuser1@gmail.com",
                                     "password": "testuser1"})
        self.assertEqual(response.status_code, 201)
        # CustomUser - check some fields expect to be returned, defaults too

        # When a new user gets created / signs up
        token = response.data['token']
        # check Markers created for new user
        response = self.client.get('/markers/', HTTP_AUTHORIZATION='JWT {}'.format(token))
        self.assertEqual(response.status_code, 200)
        # check Theme created for new user
        response = self.client.get('/theme/', HTTP_AUTHORIZATION='JWT {}'.format(token))
        self.assertEqual(response.status_code, 200)
        # check user can get User data
        response = self.client.get('/users/', HTTP_AUTHORIZATION='JWT {}'.format(token))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'testuser1')
        # should be no token returned for user object

        # cannot sign up - username & email already exist
        response = self.client.post('/users/',
                                    {"username": "testuser1",
                                     "email": "testuser1@gmail.com",
                                     "password": "testuser1"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'email': ['custom user with this email address already exists.'],
                          'username': ['custom user with this username already exists.']})

        # cannot sign up - email already exists
        response = self.client.post('/users/',
                                    {"username": "unique",
                                     "email": "testuser1@gmail.com",
                                     "password": "testuser1"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'email': ['custom user with this email address already exists.']})

        # cannot sign up - username already exists
        response = self.client.post('/users/',
                                    {"username": "testuser1",
                                     "email": "unique@gmail.com",
                                     "password": "testuser1"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'username': ['custom user with this username already exists.']})

class CustomUserLogInTestCase(TestCase):
    'CustomUserLogInTestCase'

    def setUp(self):
        'setUp'
        # create testuser1 to be able to log in with
        self.client.post('/users/', {"username": "testuser1",
                                     "email": "testuser1@gmail.com",
                                     "password": "testuser1"})

    def test_user_auth(self):
        'test_user_auth'
        # account does not exist
        response = self.client.post('/token-auth/'
                                    , {"username": "doesnotexist", "password": "doesnotexist"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"non_field_errors":["Unable to log in with provided credentials."]})

        # account exists - missing password
        response = self.client.post('/token-auth/', {"username": "testuser1"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'password': ['This field is required.']})

        # account exists - missing username
        response = self.client.post('/token-auth/', {"password": "testuser1"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'username': ['This field is required.']})

        # account exists - wrong password
        response = self.client.post('/token-auth/'
                                    , {"username": "testuser1", "password": "wrong"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'non_field_errors': ['Unable to log in with provided credentials.']})

        # account exists - wrong username
        response = self.client.post('/token-auth/'
                                    , {"username": "wrong", "password": "testuser1"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'non_field_errors': ['Unable to log in with provided credentials.']})

        # account exists - successful login
        response = self.client.post('/token-auth/'
                                    , {"username": "testuser1", "password": "testuser1"})
        self.assertEqual(response.status_code, 200)

        # When a user signs in
        token = response.data['token']
        # check user can get User data
        response = self.client.get('/users/', HTTP_AUTHORIZATION='JWT {}'.format(token))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'testuser1')
        # should be no token returned for user object
        self.assertFalse('token' in response.data)

class CustomUserDetailsTestCase(TestCase):
    'CustomUserDetailsTestCase'

    def setUp(self):
        'setUp'
        # create testuser1
        response = self.client.post('/users/', {"username": "testuser1",
                                     "email": "testuser1@gmail.com",
                                     "password": "testuser1"})
        # all tests in this class use the primary key and token associated with this CustomUser
        self.token = response.data['token']
        self.primary_key = response.data['pk']

    def test_change_password(self):
        'test_change_password'
        # Password fields didn't match
        response = self.client.put('/change_password/{}/'.format(self.primary_key)
                                   ,data = {"password": "new"
                                            , "password2": "mismatch"
                                            , "old_password": "testuser1"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                   ,content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"password":["Password fields didn't match."]})

        # Old password is not correct
        response = self.client.put(reverse('change_password', kwargs={'pk': self.primary_key})
                                   ,data = {"password": "new"
                                            , "password2": "new"
                                            , "old_password": "incorrect"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                   ,content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"old_password":{"old_password":"Old password is not correct"}})

        # successfully change password
        response = self.client.put(reverse('change_password', kwargs={'pk': self.primary_key})
                                   ,data = {"password": "new"
                                            , "password2": "new"
                                            , "old_password": "testuser1"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                   ,content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_change_username(self):
        'test_change_username'
        response = self.client.put('/users/{}/'.format(self.primary_key)
                                   ,data = {"username": "changed_username"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                   ,content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'changed_username')

        # token becomes invalid after changing username, user must log in again
        response = self.client.get('/users/', HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"detail":"Invalid signature."})

    def test_change_email(self):
        'test_change_email'
        # invalid email
        response = self.client.put('/users/{}/'.format(self.primary_key)
                                   ,data = {"email": "changed_email"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                   ,content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'email': ['Enter a valid email address.']})

        # valid email
        response = self.client.put('/users/{}/'.format(self.primary_key)
                                   ,data = {"email": "changed_email@gmail.com"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                   ,content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], 'changed_email@gmail.com')


    def test_user_icon(self):
        'test_user_icon'
        # DELETE
        response = self.client.delete('/user_icon/'
                               , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         "No uploaded icon to delete.")

    def test_change_map(self):
        'test_change_map'
        response = self.client.put('/users/{}/'.format(self.primary_key)
                                   ,data = {"map": "defaultThemeGrey"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                   ,content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['map'], 'defaultThemeGrey')

    def test_allow_feedback(self):
        'test_allow_feedback'
        response = self.client.put('/users/{}/'.format(self.primary_key)
                                   ,data = {"allow_feedback": "False"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                   ,content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['allow_feedback'])


    def test_markers(self):
        'test_markers'

        # PUT
        response = self.client.put('/markers/{}/'.format(self.primary_key)
                               , data={"attraction":"True", "sports_complex":"True"}
                               , HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                               , content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['attraction'])
        self.assertTrue(response.data['sports_complex'])
        self.assertFalse(response.data['business'])

        # GET
        response = self.client.get('/markers/'
                                   , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 200)


    def test_theme(self):
        'test_theme'
        # PUT
        response = self.client.put('/theme/{}/'.format(self.primary_key)
                               , data={"icon_color": "#000001", "font_color": "#000001"}
                               , HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                               , content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['icon_color'], "#000001")
        self.assertEqual(response.data['font_color'], "#000001")

        # GET
        response = self.client.get('/theme/'
                               , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 200)

class CustomUserDeleteTestCase(TestCase):
    'CustomUserDeleteTestCase'

    def setUp(self):
        'setUp'
        response_normaluser1 = self.client.post('/users/', {"username": "testuser1",
                                     "email": "testuser1@gmail.com",
                                     "password": "testuser1"})
        self.token_normaluser1 = response_normaluser1.data['token']
        self.pk_normaluser1 = response_normaluser1.data['pk']
        response_normaluser2 = self.client.post('/users/', {"username": "testuser2",
                                     "email": "testuser2@gmail.com",
                                     "password": "testuser2"})
        self.token_normaluser2 = response_normaluser2.data['token']

    def test_delete_user(self):
        'test_delete_user'
        # normaluser2 trying to delete normaluser1's account! the nerve!
        response = self.client.delete('/users/{}/'.format(self.pk_normaluser1)
                               , HTTP_AUTHORIZATION='JWT {}'.format(self.token_normaluser2))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(json.loads(response.content),
                         {"detail":"You do not have permission to perform this action."})

        # normaluser2 trying to delete their own account
        response = self.client.delete('/users/{}/'.format(self.pk_normaluser1)
                               , HTTP_AUTHORIZATION='JWT {}'.format(self.token_normaluser1))
        self.assertEqual(response.status_code, 204)

        # check all data associated with user is deleted
        response = self.client.get('/users/'
                                   , HTTP_AUTHORIZATION='JWT {}'.format(self.token_normaluser1))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"detail":"Invalid signature."})
        response = self.client.get('/markers/'
                                   , HTTP_AUTHORIZATION='JWT {}'.format(self.token_normaluser1))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"detail":"Invalid signature."})
        response = self.client.get('/theme/'
                                   , HTTP_AUTHORIZATION='JWT {}'.format(self.token_normaluser1))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {"detail":"Invalid signature."})


class FavoritesTestCase(TestCase):
    'FavoritesTestCase'

    def setUp(self):
        'setUp'
        stop1 = Stop.objects.create(stop_id="1234DB001234"
                                    , stop_name="Dummy Stop, stop 1234"
                                    , stop_num="1234"
                                    , stop_lat="53.3943327828838"
                                    , stop_lon="-6.39185248232822")
        stop2 = Stop.objects.create(stop_id="4321DB004321"
                                    , stop_name="Dummy Stop, stop 4321"
                                    , stop_num="4321"
                                    , stop_lat="53.3927725776921"
                                    , stop_lon="-6.39881284842172")
        cu1 = CustomUser.objects.create(username="testuser1"
                                        , email="testuser1@gmail.com"
                                        , password="testuser1")
        FavoriteStop.objects.create(owner=cu1, stop=stop1)
        FavoriteJourney.objects.create(owner=cu1, stop_origin=stop1, stop_destination=stop2)
        FavoriteLine.objects.create(owner=cu1, route_short_name="39a", direction_id="1")

        response = self.client.post('/users/', {"username": "testuser2",
                                     "email": "testuser2@gmail.com",
                                     "password": "testuser2"})
        self.token = response.data['token']
        #self.pk = response.data['pk']

    def test_favoritestop(self):
        'test_favoritestop'
        # POST
        response = self.client.post('/favoritestop/'
                                   ,data = {"stop": "doesnotexist12345"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                    )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(json.loads(response.content),
                         {"detail":"Not found."})

        response = self.client.post('/favoritestop/'
                                   ,data = {"stop": "1234DB001234"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                    )
        self.assertEqual(response.status_code, 201)

        # GET
        response = self.client.get('/favoritestop/'
                                   , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 200)

        # DELETE - testuser2 trying to delete testuser1's favoritestop
        response = self.client.delete('/favoritestop/1/'
                                      , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(json.loads(response.content),
                         {"detail":"You do not have permission to perform this action."})
        # DELETE - testuser2 trying to delete their own favoritestop
        response = self.client.delete('/favoritestop/2/'
                                      , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 204)


    def test_favoritejourney(self):
        'test_favoritejourney'
        # POST
        response = self.client.post('/favoritejourney/'
                                   ,data = {"stop_origin": "doesnotexist12345"
                                            , "stop_destination": "4321DB004321"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                    )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(json.loads(response.content),
                         {"detail":"Not found."})

        response = self.client.post('/favoritejourney/'
                                    , data={"stop_origin": "1234DB001234"
                                            , "stop_destination": "4321DB004321"}
                                    , HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                    )
        self.assertEqual(response.status_code, 201)

        # GET
        response = self.client.get('/favoritejourney/'
                                   , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 200)

        # DELETE - testuser2 trying to delete testuser1's favoritejourney
        response = self.client.delete('/favoritejourney/1/'
                                      , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(json.loads(response.content),
                         {"detail":"You do not have permission to perform this action."})
        # DELETE - testuser2 trying to delete their own favoritejourney
        response = self.client.delete('/favoritejourney/2/'
                                      , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 204)

    def test_favoriteline(self):
        'test_favoriteline'
        # POST
        response = self.client.post('/favoriteline/'
                                   ,data = {"route_short_name": "37", "direction_id": "1"}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token)
                                    )
        self.assertEqual(response.status_code, 201)

        # GET
        response = self.client.get('/favoriteline/'
                                   , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 200)

        # DELETE - testuser2 trying to delete testuser1's favoriteline
        response = self.client.delete('/favoriteline/1/'
                                      , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(json.loads(response.content),
                         {"detail":"You do not have permission to perform this action."})
        # DELETE - testuser2 trying to delete their own favoriteline
        response = self.client.delete('/favoriteline/2/'
                                      , HTTP_AUTHORIZATION='JWT {}'.format(self.token))
        self.assertEqual(response.status_code, 204)

class FeedbackTestCase(TestCase):
    'FeedbackTestCase'

    def setUp(self):
        'setUp'
        # create a normal user and a superuser
        response_normaluser = self.client.post('/users/', {"username": "testuser1",
                                     "email": "testuser1@gmail.com",
                                      "password": "testuser1"})
        self.token_normaluser = response_normaluser.data['token']

        response_superuser = self.client.post('/users/',{"username": "superuser1",
                                     "email": "superuser1@gmail.com",
                                     "password": "superuser1",
                                     "is_staff": "True",
                                     "is_superuser": "True"})
        self.token_superuser = response_superuser.data['token']

    def test_feedback(self):
        'test_feedback'
        # feedback_question - POST - superuser
        response = self.client.post('/feedback_question/'
                                   ,data = {"question_number": "1"
                                            , "question_text": "Please rate our app from 1-5."}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token_superuser)
                                   ,content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content),
                         {"question_number":1,"question_text":"Please rate our app from 1-5."})

        # POST - feedback question with this question number already exists
        response = self.client.post('/feedback_question/'
                                   ,data = {"question_number": "1"
                                            , "question_text": "Please write an opinion.."}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token_superuser)
                                   ,content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"question_number"
                          :["feedback question with this question number already exists."]})

        # feedback_question - GET - superuser
        response = self.client.get('/feedback_question/1/'
                                   , HTTP_AUTHORIZATION='JWT {}'.format(self.token_superuser))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content),
                         {"question_number":1,"question_text":"Please rate our app from 1-5."})

        # feedback_question - POST - normaluser
        response = self.client.post('/feedback_question/'
                                   ,data = {"question_number": "10"
                                            , "question_text": "Please rate our app from 1-5."}
                                   ,HTTP_AUTHORIZATION='JWT {}'.format(self.token_normaluser)
                                   ,content_type='application/json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(json.loads(response.content),
                         {"detail":"You do not have permission to perform this action."})

        # feedback_question - GET - normaluser
        response = self.client.get('/feedback_question/1/'
                                   , HTTP_AUTHORIZATION='JWT {}'.format(self.token_normaluser))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(json.loads(response.content),
                         {"detail":"You do not have permission to perform this action."})

        # feedback_question - POST -
        # any authenticated user can post an answer to an existing feedback question
        response = self.client.post('/feedback_answer/'
                                , data={"question": "1"
                                        , "rating": "5"
                                        , "text": "This is my feedback."}
                                , HTTP_AUTHORIZATION='JWT {}'.format(self.token_superuser)
                                , content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content),
                     {"id": 1, "rating": 5, "text": "This is my feedback.", "question": 1})


class UnauthorisedRoutesTestCase1(TestCase):
    'UnauthorisedRoutesTestCase1'

    def setUp(self):
        'setUp'
        stop1 = Stop.objects.create(stop_id="1234DB001234"
                                    , stop_name="Dummy Stop, stop 1234"
                                    , stop_num="1234"
                                    , stop_lat="53.3943327828838"
                                    , stop_lon="-6.39185248232822")
        stop2 = Stop.objects.create(stop_id="4321DB004321"
                                    , stop_name="Dummy Stop, stop 4321"
                                    , stop_num="4321"
                                    , stop_lat="53.3927725776921"
                                    , stop_lon="-6.39881284842172")
        Line.objects.create(stop=stop1, line="37")
        Line.objects.create(stop=stop1, line="39")
        Line.objects.create(stop=stop1, line="39a")
        route = Route.objects.create(route_id="90-37-d12-1"
                                     , agency_id="978"
                                     , route_short_name="37"
                                     , route_long_name=""
                                     , route_type="3")
        calendar = Calendar.objects.create(service_id="y12345"
                                           , monday="1"
                                           ,tuesday="1"
                                           ,wednesday="1"
                                           ,thursday="1"
                                           ,friday="1"
                                           ,saturday="1"
                                           ,sunday="1"
                                           ,start_date="2021-01-01"
                                           ,end_date="2099-01-01")
        trip = Trip.objects.create(route=route
                                   , calendar=calendar
                                   , trip_id="4028.y12345.90-37-d12-1.38.I"
                                   , shape_id="90-37-d12-1.38.I"
                                   , trip_headsign="Dummy 1- Dummy 2"
                                   , direction_id="1")
        Shape.objects.create(shape_id="90-37-d12-1.38.I"
                             ,shape_pt_lat="53.3942225535033"
                             ,shape_pt_lon="-6.39167619978278"
                             ,shape_pt_sequence="1"
                             ,shape_dist_traveled="0.00")
        Shape.objects.create(shape_id="90-37-d12-1.38.I"
                             ,shape_pt_lat="53.3948455819658"
                             ,shape_pt_lon="-6.39055502092115"
                             ,shape_pt_sequence="2"
                             ,shape_dist_traveled="101.62")
        StopTime.objects.create(trip=trip, arrival_time="23:00:00"
                                , departure_time="23:00:00", stop=stop1
                                ,stop_sequence="1", stop_headsign="Dummy"
                                , pickup_type="0", drop_off_type="0",
                                shape_dist_traveled="0.00")
        StopTime.objects.create(trip=trip, arrival_time="23:01:55"
                                , departure_time="23:01:55", stop=stop2
                                , stop_sequence="3", stop_headsign="Dummy"
                                , pickup_type="0", drop_off_type="0",
                                shape_dist_traveled="1064.70")

    def test_stops(self):
        'test_stops'
        response = self.client.get('/stops/')
        self.assertEqual(response.status_code, 200)
        res = json.loads(response.content)[0]
        self.assertEqual(res['stop_id'], "1234DB001234")
        self.assertEqual(res['stop_name'], "Dummy Stop, stop 1234")
        self.assertEqual(res['stop_num'], 1234)
        self.assertEqual(res['stop_lat'], 53.3943327828838)
        self.assertEqual(res['stop_lon'], -6.39185248232822)
        self.assertEqual(res['stop_lines'], ["37", "39", "39a"])


    def test_route(self):
        'test_route'
        response = self.client.get('/route/90-37-d12-1/')
        self.assertEqual(response.status_code, 200)
        res = json.loads(response.content)
        self.assertEqual(res['route_id'], "90-37-d12-1")
        self.assertEqual(res['route_name'], "37")
        self.assertEqual(res['trips'][0]['trip_id'], "4028.y12345.90-37-d12-1.38.I")
        self.assertEqual(res['trips'][0]['stops'][0]['stop_id'], "1234DB001234")
        self.assertEqual(res['trips'][0]['stops'][0]['arrival_time'], "23:00:00")
        self.assertEqual(res['trips'][0]['stops'][0]['departure_time'], "23:00:00")
        self.assertEqual(res['trips'][0]['stops'][0]['stop_sequence'], 1)
        self.assertEqual(res['trips'][0]['stops'][1]['stop_id'], "4321DB004321")
        self.assertEqual(res['trips'][0]['stops'][1]['arrival_time'], "23:01:55")
        self.assertEqual(res['trips'][0]['stops'][1]['departure_time'], "23:01:55")
        self.assertEqual(res['trips'][0]['stops'][1]['stop_sequence'], 3)

    def test_lines(self):
        'test_lines'
        url = reverse('lines')
        response = self.client.get(url) # '/lines/'
        self.assertEqual(response.status_code, 200)
        res = json.loads(response.content)[0]
        self.assertEqual(res['route_id'], "90-37-d12-1")
        self.assertEqual(res['direction_id'], 1)
        self.assertEqual(res['trip_headsign'], "Dummy 1- Dummy 2")
        self.assertEqual(res['route__route_short_name'], "37")
        self.assertEqual(res['trip_id'], "4028.y12345.90-37-d12-1.38.I")
        self.assertEqual(res['stops'][0]['arrival_time'], "23:00:00")
        self.assertEqual(res['stops'][0]['departure_time'], "23:00:00")
        self.assertEqual(res['stops'][0]['stop_sequence'], 1)
        self.assertEqual(res['stops'][0]['stop_headsign'], "Dummy")
        self.assertEqual(res['stops'][0]['shape_dist_traveled'], 0.0)
        self.assertEqual(res['stops'][0]['stop_id'], "1234DB001234")
        self.assertEqual(res['stops'][0]['stop_name'], "Dummy Stop, stop 1234")
        self.assertEqual(res['stops'][0]['stop_num'], 1234)
        self.assertEqual(res['stops'][0]['stop_lat'], 53.3943327828838)
        self.assertEqual(res['stops'][0]['stop_lon'], -6.39185248232822)
        self.assertEqual(res['stops'][1]['arrival_time'], "23:01:55")
        self.assertEqual(res['stops'][1]['departure_time'], "23:01:55")
        self.assertEqual(res['stops'][1]['stop_sequence'], 3)
        self.assertEqual(res['stops'][1]['stop_headsign'], "Dummy")
        self.assertEqual(res['stops'][1]['shape_dist_traveled'], 1064.7)
        self.assertEqual(res['stops'][1]['stop_id'], "4321DB004321")
        self.assertEqual(res['stops'][1]['stop_name'], "Dummy Stop, stop 4321")
        self.assertEqual(res['stops'][1]['stop_num'], 4321)
        self.assertEqual(res['stops'][1]['stop_lat'], 53.3927725776921)
        self.assertEqual(res['stops'][1]['stop_lon'], -6.39881284842172)

    def test_stops_by_trip(self):
        'test_stops_by_trip'
        response = self.client.get('/stops_by_trip/4028.y12345.90-37-d12-1.38.I/')
        self.assertEqual(response.status_code, 200)
        res = json.loads(response.content)
        self.assertEqual(res[0]['arrival_time'], "23:00:00")
        self.assertEqual(res[0]['departure_time'], "23:00:00")
        self.assertEqual(res[0]['stop_sequence'], 1)
        self.assertEqual(res[0]['stop_headsign'], "Dummy")
        self.assertEqual(res[0]['shape_dist_traveled'], 0.0)
        self.assertEqual(res[0]['stop_id'], "1234DB001234")
        self.assertEqual(res[0]['stop_name'], "Dummy Stop, stop 1234")
        self.assertEqual(res[0]['stop_num'], 1234)
        self.assertEqual(res[0]['stop_lat'], 53.3943327828838)
        self.assertEqual(res[0]['stop_lon'], -6.39185248232822)
        self.assertEqual(res[1]['arrival_time'], "23:01:55")
        self.assertEqual(res[1]['departure_time'], "23:01:55")
        self.assertEqual(res[1]['stop_sequence'], 3)
        self.assertEqual(res[1]['stop_headsign'], "Dummy")
        self.assertEqual(res[1]['shape_dist_traveled'], 1064.7)
        self.assertEqual(res[1]['stop_id'], "4321DB004321")
        self.assertEqual(res[1]['stop_name'], "Dummy Stop, stop 4321")
        self.assertEqual(res[1]['stop_num'], 4321)
        self.assertEqual(res[1]['stop_lat'], 53.3927725776921)
        self.assertEqual(res[1]['stop_lon'], -6.39881284842172)

    def test_shape_by_trip(self):
        'test_shape_by_trip'
        response = self.client.get('/shape_by_trip/4028.y12345.90-37-d12-1.38.I/')
        self.assertEqual(response.status_code, 200)
        res = json.loads(response.content)
        self.assertEqual(res[0]['id'], 1)
        self.assertEqual(res[0]['shape_id'], "90-37-d12-1.38.I")
        self.assertEqual(res[0]['shape_pt_lat'], 53.3942225535033)
        self.assertEqual(res[0]['shape_pt_lon'], -6.39167619978278)
        self.assertEqual(res[0]['shape_pt_sequence'], 1)
        self.assertEqual(res[0]['shape_dist_traveled'], 0.0)
        self.assertEqual(res[1]['id'], 2)
        self.assertEqual(res[1]['shape_id'], "90-37-d12-1.38.I")
        self.assertEqual(res[1]['shape_pt_lat'], 53.3948455819658)
        self.assertEqual(res[1]['shape_pt_lon'], -6.39055502092115)
        self.assertEqual(res[1]['shape_pt_sequence'], 2)
        self.assertEqual(res[1]['shape_dist_traveled'], 101.62)


    def test_stop(self):
        'test_stop'
        # stop does not exist
        response = self.client.get('/stop/8240DB009999/')
        self.assertEqual(response.status_code, 404)

# Testing api.py    Unauthorised    same as above just testing apis using tastypie.test
class UnauthorisedRoutesTestCase2(ResourceTestCaseMixin, TestCase):
    'UnauthorisedRoutesTestCase2'

    def get_credentials(self):
        pass

    # html
    def test_get_api_json_index(self):
        'test_get_api_json_index'
        response = self.api_client.get('', format='html')
        self.assertEqual(response.status_code, 200)

    # Stop Line
    def test_get_api_json_stops(self):
        'test_get_api_json_stops'
        response = self.api_client.get('/stops/', format='json')
        self.assertValidJSONResponse(response)
        res = json.loads(response.content)[0]
        self.assertEqual(res['stop_id'], "1234DB001234")
        self.assertEqual(res['stop_name'], "Dummy Stop, stop 1234")
        self.assertEqual(res['stop_num'], 1234)
        self.assertEqual(res['stop_lat'], 53.3943327828838)
        self.assertEqual(res['stop_lon'], -6.39185248232822)
        self.assertEqual(res['stop_lines'], ["37", "39", "39a"])

    # Route Trip StopTime
    def test_get_api_json_route(self):
        'test_get_api_json_route'
        response = self.api_client.get('/route/90-37-d12-1/', format='json')
        self.assertValidJSONResponse(response)

    # Calendar Trip StopTime
    def test_get_api_json_lines(self):
        'test_get_api_json_lines'
        response = self.api_client.get('/lines/', format='json')
        self.assertValidJSONResponse(response) # response.content b'[]'

    # StopTime
    def test_get_api_json_stops_by_trip(self):
        'test_get_api_json_stops_by_trip'
        response = self.api_client.get('/stops_by_trip/4028.y12345.90-37-d12-1.38.I/'
                                       , format='json')
        self.assertValidJSONResponse(response)

    # Trip Shape
    def test_get_api_json_shape_by_trip(self):
        'test_get_api_json_shape_by_trip'
        response = self.api_client.get('/shape_by_trip/4028.y12345.90-37-d12-1.38.I/'
                                       , format='json')
        self.assertValidJSONResponse(response)
