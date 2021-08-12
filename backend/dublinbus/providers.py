from google.auth import jwt
from google.auth import _helpers
from google.auth.transport import requests
from google.oauth2 import id_token
import facebook

# overriding _verify_iat_and_exp to account for server system clock
# being behind by approximately 25 minutes
def _verify_iat_and_exp_edited(payload):
    """Verifies the ``iat`` (Issued At) and ``exp`` (Expires) claims in a token
    payload.

    Args:
        payload (Mapping[str, str]): The JWT payload.

    Raises:
        ValueError: if any checks failed.
    """
    now = _helpers.datetime_to_secs(_helpers.utcnow())

    # Make sure the iat and exp claims are present.
    for key in ("iat", "exp"):
        if key not in payload:
            raise ValueError("Token does not contain required claim {}".format(key))

    # Make sure the token wasn't issued in the future.
    iat = payload["iat"]
    # Err on the side of accepting a token that is slightly early to account
    # for clock skew.
    earliest = iat - _helpers.CLOCK_SKEW_SECS  - 1800
    if now < earliest:
        raise ValueError("Token used too early - even on ucd server!, {} < {}".format(now, iat))

jwt._verify_iat_and_exp = _verify_iat_and_exp_edited


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
