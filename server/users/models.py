from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from organizations.models import Organization


class UserProfile(AbstractUser):
    """
    An abstract base class implementing a fully featured User model with
    admin-compliant permissions.

    Username and password are required. Other fields are optional.
    """
    
    email = models.EmailField(_('email address'), blank=True)

    is_admin = models.BooleanField(
        _('admin user'),
        default=False,
        help_text=_('Designates whether the user has admin permissions.'),
    )

    organization = models.ForeignKey('organizations.Organization', on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'user profile'
        verbose_name_plural = 'user profiles'

    def __str__(self):
        return self.username


