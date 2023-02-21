from django.contrib import admin
from .models import Student
from .models import SelfReportEngagement
from .models import SystemDetectedEngagement

# Register your models here.
admin.site.register(Student)
admin.site.register(SelfReportEngagement)
admin.site.register(SystemDetectedEngagement)