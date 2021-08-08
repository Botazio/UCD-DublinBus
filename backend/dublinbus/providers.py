from google.auth.transport import requests
from google.oauth2 import id_token
import facebook

class Provider:
    """Class to fetch the user info from Google or Facebook and return it"""

    @staticmethod
    def validate_google(auth_token):
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
        return None

    @staticmethod
    def validate_facebook(auth_token):
        """
        validate method Queries the facebook GraphAPI to fetch the user info
        """
        try:
            graph = facebook.GraphAPI(access_token=auth_token)
            profile = graph.request('/me?fields=name,email')
            return profile
        except facebook.GraphAPIError as invalid_token:
            return invalid_token
