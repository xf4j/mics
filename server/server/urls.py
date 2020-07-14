"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.contrib.auth.decorators import login_required
from rest_framework import routers
from django.views.generic.base import TemplateView
# from django.conf.urls.static import static
from django.conf import settings
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

from organizations.views import OrganizationViewSet
from users.views import UserViewSet
from patients.views import PatientViewSet
# from studies.views import StudyViewSet, redirect_view


router = routers.DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'users', UserViewSet)
router.register(r'patients', PatientViewSet)
# router.register(r'studies', StudyViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
    path('api/token-auth/', obtain_jwt_token),
    path('api/token-refresh/', refresh_jwt_token),
    path('api/files/', include('files.urls')),
    path('api/studies/', include('imagestudy.urls')),
    path('api/viewer/', include('viewer.urls')),
    # # url(r'^%s(?P<path>.*)$' % settings.MEDIA_URL[1:], protected_serve, {'document_root': settings.MEDIA_ROOT}), # media file urls
    # path('report-viewer.worker.js', redirect_view), # redirect adds static/client to url
    path('', TemplateView.as_view(template_name='index.html'), name='home')
]

urlpatterns += [re_path(r'(.*)', TemplateView.as_view(template_name='index.html'), name='home')]