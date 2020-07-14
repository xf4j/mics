from django.db import models

# Create your models here.
class ViewerSeriesDetail(object):
    def __init__(self, series):
        self.series = series