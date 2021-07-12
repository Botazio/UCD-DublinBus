from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth import get_user_model
from .models import FavouriteStop, Stop, FavouriteJourney


class FavouriteStopSerializer(serializers.ModelSerializer):
    '''FavouriteStopSerializer'''
    stop = serializers.PrimaryKeyRelatedField(queryset=Stop.objects.all(), many=False)
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = FavouriteStop
        fields = ('pk', 'created', 'owner', 'stop')

class FavouriteJourneySerializer(serializers.ModelSerializer):
    '''FavouriteJourneySerializer'''
    stop_origin = serializers.PrimaryKeyRelatedField(queryset=Stop.objects.all(), many=False)
    stop_destination = serializers.PrimaryKeyRelatedField(queryset=Stop.objects.all(), many=False)
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = FavouriteJourney
        fields = ('pk', 'created', 'owner', "stop_origin", "stop_destination")

class UserSerializer(serializers.ModelSerializer):
    '''UserSerializer'''
    favouritestops = serializers.PrimaryKeyRelatedField(many=True, 
                                                        queryset=FavouriteStop.objects.all())
    favouritejourneys = serializers.PrimaryKeyRelatedField(many=True, 
                                                        queryset=FavouriteJourney.objects.all())
    class Meta:
        model = get_user_model() # User
        fields = ('pk', 'username', 'email', 'favouritestops', 'favouritejourneys')

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
        return instance

    class Meta:
        model = get_user_model() # User
        fields = ('token', 'password', 'pk', 'username', 'email', 'is_staff', 'is_superuser')
