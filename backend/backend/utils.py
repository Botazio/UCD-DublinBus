from dublinbus.serializers import UserSerializer


def my_jwt_response_handler(token, user=None, request=None):
    ''' JWT response handler
    Adds a new ‘user’ field with the user’s serialized data when a token is generated
    '''
    response = UserSerializer(user, context={'request': request}).data
    response["token"] = token
    return response
