from rest_framework_jwt.utils import jwt_payload_handler
''' Custom payload handler
return custom encrypted token by function
'''
def jwt_custom_payload_handler(user):
    payload = jwt_payload_handler(user)
    payload['is_staff'] = user.is_staff
    
    payload['organization'] = user.profile.organization.name if hasattr(user, 'profile') else None
    payload['organization_id'] = user.profile.organization.id if hasattr(user, 'profile') else None
    payload['is_admin'] = user.profile.is_admin if hasattr(user, 'profile') else None
    return payload