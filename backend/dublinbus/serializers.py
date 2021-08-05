from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth import get_user_model
from .models import FavoriteStop, FavoriteJourney, Marker, Theme


class FavoriteStopSerializer(serializers.ModelSerializer):
    '''FavoriteStopSerializer'''
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = FavoriteStop
        fields = ('pk', 'created', 'owner', 'stop')
        depth = 1

class FavoriteJourneySerializer(serializers.ModelSerializer):
    '''FavoriteJourneySerializer'''
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = FavoriteJourney
        fields = ('pk', 'created', 'owner', "stop_origin", "stop_destination")
        depth = 1

class UserSerializer(serializers.ModelSerializer):
    '''UserSerializer'''

    class Meta:
        model = get_user_model()
        fields = ('date_joined',
                  'is_staff',
                  'is_superuser',
                  'username',
                  'password',
                  'email',
                  'favoritestops',
                  'favoritejourneys',
                  'pk',
                  'image',
                  'theme',
                  'map',
                  'markers')
        depth = 1

class UserSerializerWithToken(serializers.ModelSerializer):
    ''' Serializer class for handling signups
    When a user signs up, the response from the server includes both their relevant
    user data (username etc.), as well as the token,
    which is stored in the browser for further authentication.
    '''
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    @staticmethod
    def get_token(obj): # self,
        ''' Method which handles the manual creation of a new token '''
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        ''' Overriding the serializer’s create() method,
        which determines how the object being serialized gets saved to the database '''
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        marker = Marker.objects.create(owner=instance)
        marker.save()
        theme = Theme.objects.create(owner=instance)
        theme.save()
        return instance

    class Meta:
        model = get_user_model()
        fields = ('date_joined',
                  'is_staff',
                  'is_superuser',
                  'username',
                  'password',
                  'token',
                  'email',
                  'favoritestops',
                  'favoritejourneys',
                  'pk',
                  'image',
                  'theme',
                  'map',
                  'markers')
        depth = 1

class MarkerSerializer(serializers.ModelSerializer):
    '''MarkerSerializer'''
    class Meta:
        model = Marker
        fields = '__all__'

class ThemeSerializer(serializers.ModelSerializer):
    '''ThemeSerializer'''
    class Meta:
        model = Theme
        fields = '__all__'

class ChangePasswordSerializer(serializers.ModelSerializer):
    '''ChangePasswordSerializer'''
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = get_user_model()
        fields = ('old_password', 'password', 'password2')

    def validate(self, attrs):
        '''check new password entered twice match'''
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def validate_old_password(self, value):
        '''check old password is correct'''
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):
        '''change password'''
        instance.set_password(validated_data['password'])
        instance.save()
        return instance
