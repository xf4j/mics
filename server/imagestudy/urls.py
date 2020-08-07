from django.urls import path
from . import views

urlpatterns = [
    path('', views.ImageStudyViewSet.as_view({'get': 'list'})),
    path('<str:uid>/', views.ImageStudyDetail.as_view()),
    path('<str:uid>/<str:pid>/', views.ImageStudies.as_view()),
    # path('series/<str:uid>/', views.SeriesDetail.as_view())
]
