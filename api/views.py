from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import StudentSerializer
from .serializers import SelfReportEngagementSerializer
from .serializers import SystemDetectedEngagementSerializer
from .models import Student
from .models import SelfReportEngagement
from .models import SystemDetectedEngagement

# Create your views here.
@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List': '/student-list/',
        'Detail View': '/student-detail/<int:id>/',
        'Create': '/student-create/',
        'Update': '/student-update/<int:id>/',
        'Delete': '/student-delete/<int:id>/',
    }

    return Response(api_urls)

#STUDENT MODEL FUNCTIONS
@api_view(['GET'])
def ShowAllStudent(request):
    students = Student.objects.all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def ViewStudent(request, pk):
    student = Student.objects.get(id=pk)
    serializer = StudentSerializer(student, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def CreateStudent(request):
    serializer = StudentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def UpdateStudent(request, pk):
    student = Student.objects.get(id=pk)
    serializer = StudentSerializer(instance=student, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['GET'])
def DeleteStudent(request, pk):
    student = Student.objects.get(id=pk)
    student.delete()

    return Response('Student deleted successfully!')

#SELF REPORT ENGAGEMENT MODEL FUNCTIONS
@api_view(['GET'])
def ShowAllSelfReport(request):
    selfReport = SelfReportEngagement.objects.all()
    serializer = SelfReportEngagementSerializer(selfReport, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def ViewSelfReport(request, pk):
    selfReport = SelfReportEngagement.objects.get(id=pk)
    serializer = SelfReportEngagementSerializer(selfReport, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def CreateSelfReport(request):
    serializer = SelfReportEngagementSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def UpdateSelfReport(request, pk):
    selfReport = SelfReportEngagement.objects.get(id=pk)
    serializer = SelfReportEngagementSerializer(instance=selfReport, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['GET'])
def DeleteSelfReport(request, pk):
    selfReport = SelfReportEngagement.objects.get(id=pk)
    selfReport.delete()

    return Response('Student self-report data deleted successfully!')

#SYSTEM DETECTED ENGAGEMENT MODEL FUNCTIONS 
@api_view(['GET'])
def ShowAllSystemDetected(request):
    systemDetected = SystemDetectedEngagement.objects.all()
    serializer = SystemDetectedEngagementSerializer(systemDetected, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def ViewSystemDetected(request, pk):
    systemDetected = SystemDetectedEngagement.objects.get(id=pk)
    serializer = SystemDetectedEngagementSerializer(systemDetected, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def CreateSystemDetected(request):
    serializer = SystemDetectedEngagementSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def UpdateSystemDetected(request, pk):
    systemDetected = SystemDetectedEngagement.objects.get(id=pk)
    serializer = SystemDetectedEngagementSerializer(instance=systemDetected, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['GET'])
def DeleteSystemDetected(request, pk):
    systemDetected = SystemDetectedEngagementSerializer.objects.get(id=pk)
    systemDetected.delete()

    return Response('System-detected student engagement data deleted successfully!')