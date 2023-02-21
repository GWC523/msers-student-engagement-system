from rest_framework import serializers

from .models import Student
from .models import SelfReportEngagement
from .models import SystemDetectedEngagement

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class SelfReportEngagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelfReportEngagement
        fields = '__all__'

class SystemDetectedEngagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemDetectedEngagement
        fields = '__all__'