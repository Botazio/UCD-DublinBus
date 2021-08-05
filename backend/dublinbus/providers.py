from google.auth.transport import requests
from google.oauth2 import id_token
import facebook

class Google:
    """Google class to fetch the user info and return it"""

    @staticmethod
    def validate(auth_token):
        """
        validate method Queries the Google oAUTH2 api to fetch the user info
        """
        try:
            idinfo = id_token.verify_oauth2_token(
                auth_token, requests.Request())

            # checking if ISSuer of this auth_token is a Google server
            if 'accounts.google.com' in idinfo['iss']:
                return idinfo

        except ValueError as invalid_token:
            return invalid_token

class Facebook:
    """Facebook class to fetch the user info and return it"""

    @staticmethod
    def validate(auth_token):
        """
        validate method Queries the facebook GraphAPI to fetch the user info
        """
        try:
            graph = facebook.GraphAPI(access_token=auth_token)
            profile = graph.request('/me?fields=name,email')
            return profile
        except facebook.GraphAPIError as invalid_token:
            return invalid_token
