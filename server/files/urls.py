from django.urls import path
from . import views

urlpatterns = [
    path('upload-dicom/', views.UploadDicomFile.as_view()),
    # path('upload-report/', views.UploadReport.as_view()),
    # path('upload-mseg/', views.UploadMseg.as_view()),
    # path('download-studies/', views.DownloadStudies.as_view())
]