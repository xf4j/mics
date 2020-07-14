from django.urls import path
from . import views

urlpatterns = [
    path('<str:series_instance_uid>/valid/', views.series_instance_uid_valid), 
    path('<str:series_instance_uid>/', views.ViewerSeriesDetail.as_view()),
    path('instances/<str:sop_instance_uid>/', views.ViewerInstance.as_view())
]
