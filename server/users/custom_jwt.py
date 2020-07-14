from datetime import datetime
from calendar import timegm
from rest_framework_jwt.settings import api_settings

def jwt_payload_handler(user):
    """ Custom payload handler
    Token encrypts the dictionary returned by this function, and can be decoded by rest_framework_jwt.utils.jwt_decode_handler
    """
    return {
        'username': user.username,
        'user_id': user.pk,
        'organization': user.profile.organization.name if hasattr(user, 'profile') else None,
        'organization_id': user.profile.organization.id if hasattr(user, 'profile') else None,
        'is_admin': user.profile.is_admin if hasattr(user, 'profile') else user.is_staff,
        'is_staff': user.is_staff,
        'exp': datetime.utcnow() + api_settings.JWT_EXPIRATION_DELTA,
        'orig_iat': timegm(datetime.utcnow().utctimetuple())
    }

# def jwt_response_payload_handler(token, user=None, request=None):
#     return {
#         'token': token,
#         'user': {
#             'email': user.email
#         }
#         # 'admin_status': request.user.profile.is_admin or 'none',
#         # 'staff_status': request.user.is_staff or 'none',
#     }