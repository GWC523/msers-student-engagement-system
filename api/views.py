from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import HttpResponseBadRequest
from .serializers import StudentSerializer
from .serializers import SelfReportEngagementSerializer
from .serializers import SystemDetectedEngagementSerializer
from .serializers import SelfReportInfoSerializer
from .models import Student
from .models import SelfReportEngagement
from .models import SystemDetectedEngagement
from .models import SelfReportInfo
from .main import MSERS
from django.views.decorators.csrf import csrf_exempt
import base64
import numpy as np
import cv2
from django.shortcuts import get_object_or_404



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

#SELF REPORT INFO MODEL FUNCTIONS
@api_view(['GET'])
def ShowAllSelfReportInfo(request):
    selfReport = SelfReportInfo.objects.all()
    serializer = SelfReportInfoSerializer(selfReport, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def ViewSelfReportInfo(request, pk):
    selfReport = SelfReportInfo.objects.get(id=pk)
    serializer = SelfReportInfoSerializer(selfReport, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def CreateSelfReportInfo(request):
    serializer = SelfReportInfoSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def UpdateSelfReportInfo(request, pk):
    selfReport = SelfReportInfo.objects.get(id=pk)
    serializer = SelfReportInfoSerializer(instance=selfReport, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['GET'])
def DeleteSelfReportInfo(request, pk):
    selfReport = SelfReportInfo.objects.get(id=pk)
    selfReport.delete()

    return Response('Student self-report data deleted successfully!')

#SELF REPORT ENGAGEMENT MODEL FUNCTIONS
@api_view(['GET'])
def ShowAllSelfReportEngagement(request):
    selfReport = SelfReportEngagement.objects.all()
    serializer = SelfReportEngagementSerializer(selfReport, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def ViewSelfReportEngagement(request, pk):
    selfReport = SelfReportEngagement.objects.get(id=pk)
    serializer = SelfReportEngagementSerializer(selfReport, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def CreateSelfReportEngagement(request):
    serializer = SelfReportEngagementSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def UpdateSelfReportEngagement(request, pk):
    selfReport = SelfReportEngagement.objects.get(id=pk)
    serializer = SelfReportEngagementSerializer(instance=selfReport, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['GET'])
def DeleteSelfReportEngagement(request, pk):
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

#Detector 
@api_view(['POST'])
def DetermineEngagement(request):
    msers = MSERS()
    if request.method != 'POST':
        return HttpResponseBadRequest('Invalid request method')

    print("REQUEST DATA:", request.data.get('student_id'))
    student_id = request.data.get('student_id')
    participant_id = request.data.get('participant_id')
    timestamp = request.data.get('timestamp')
    frame_data = request.data.get('frame_data')
    last_frame = request.data.get('last_frame')
    emotional_engagement = request.data.get('emotional_engagement')

    if frame_data is None:
        # handle the case where frame_data is None
        return Response('No frame data received')

    converted_frame_data = base64.b64decode(frame_data.split(',')[1])
    img_array = np.frombuffer(converted_frame_data, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    # last_obj = SystemDetectedEngagement.objects.filter(participant_id=participant_id).order_by('-timestamp').first()

    if last_frame is not None and last_frame != '':
        converted_last_obj = base64.b64decode(last_frame.split(',')[1])
        last_img_array = np.frombuffer(converted_last_obj, np.uint8)
        last_img = cv2.imdecode(last_img_array, cv2.IMREAD_COLOR)
    else:
        last_img = None

    engagement_result = msers.detect_overall_eng_per_frame(img, last_img, last_img, emotional_engagement)


    frame = SystemDetectedEngagement(timestamp=timestamp,
                                     student_id=student_id, 
                                     participant_id=participant_id,
                                     emotional_engagement=engagement_result["emotional"],
                                     behavioral_engagement=engagement_result["behavioral"],
                                     cognitive_engagement=engagement_result["cognitive"])
    frame.save()

    return Response('Engagement added successfully')