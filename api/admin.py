from django.contrib import admin
from .models import Student
from .models import SelfReportEngagement
from .models import SystemDetectedEngagement
from .models import SelfReportInfo

# Register your models here.
admin.site.register(Student)
admin.site.register(SelfReportEngagement)
admin.site.register(SelfReportInfo)
admin.site.register(SystemDetectedEngagement)