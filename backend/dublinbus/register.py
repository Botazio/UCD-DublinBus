import random
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
import dublinbus
import environ

env = environ.Env()
environ.Env.read_env()

def generate_username(name):
    '''recursive function to create unique username'''
    username = "".join(name.split(' ')).lower() # "John Doe" -> "johndoe"
    if not get_user_model().objects.filter(username=username).exists():
        # if we do not have this username then use it
        return username
    random_username = username + str(random.randint(0, 1000))
    return generate_username(random_username)

def register_social_user(provider, email, name):
    '''function to create or log in a social account user'''
    filtered_user_by_email = get_user_model().objects.filter(email=email)

    if filtered_user_by_email.exists():
        if provider != filtered_user_by_email[0].auth_provider:
            # i. email exists in app, but from a different social account (auth_provider)
            # i.e. user is using same email address to sign in/up from another platform
            raise AuthenticationFailed(
                detail='Please login using ' + filtered_user_by_email[0].auth_provider)

        # ii. email exists in app and from same social account (auth_provider)
        # log user in and refresh token
        print('register.py - Logging into user social account - ', provider, email)
        registered_user = authenticate(
            username=filtered_user_by_email[0].username,
            password=env('SOCIAL_SECRET')
        )
        serializer = dublinbus.serializers.UserSerializerWithToken(registered_user)
        return serializer.data

    # iii. email does not exist in app - create new social account user
    print('register.py - Creating new social account user - ', provider, email)
    serializer = dublinbus.serializers.UserSerializerWithToken(
        data={'username': generate_username(name),
              'password': env('SOCIAL_SECRET'),
              'email': email,
              'auth_provider': provider}
    )
    if serializer.is_valid():
        serializer.save()
        return serializer.data
    return None
