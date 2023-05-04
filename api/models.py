from django.db import models
from django.utils import timezone

# Create your models here.
class Student(models.Model):
    student_id = models.CharField(max_length=100, null=False, blank=False)
    name = models.CharField(max_length=100, null=False, blank=False)
    age = models.IntegerField(null=False, blank=False)
    gender = models.CharField(max_length=100, null=False, blank=False)
    year_level = models.IntegerField(null=False, blank=False)
    program = models.CharField(max_length=250, null=False, blank=False)
    
    def __str__(self):
        return self.student_id

class SelfReportInfo(models.Model):
    participant_id = models.CharField(max_length=100, null=False, blank=False, default=b'')
    student_id = models.CharField(max_length=100, null=False, blank=False, default=b'')
    environment = models.CharField(max_length=100, null=False, blank=False, default=b'')
    lighting_condition = models.CharField(max_length=100, null=False, blank=False, default=b'')
    camera_spec = models.TextField(null=False, blank=False, default=b'')
    computer_spec = models.TextField(null=False, blank=False, default=b'')

class SelfReportEngagement(models.Model):
    participant_id = models.CharField(max_length=100, null=False, blank=False, default=b'')
    student_id = models.CharField(max_length=100, null=False, blank=False, default=b'')
    slide_no = models.CharField(max_length=100, null=False, blank=False, default=b'')
    q1 = models.IntegerField(null=False, blank=False)
    q2 = models.IntegerField(null=False, blank=False)
    q3 = models.IntegerField(null=False, blank=False)
    q4 = models.IntegerField(null=False, blank=False)
    q5 = models.IntegerField(null=False, blank=False)
    q6 = models.IntegerField(null=False, blank=False)
    q7 = models.IntegerField(null=False, blank=False)
    q8 = models.IntegerField(null=False, blank=False)
    q9 = models.IntegerField(null=False, blank=False)
    q10 = models.IntegerField(null=False, blank=False)
    q11 = models.IntegerField(null=False, blank=False)
    q12 = models.IntegerField(null=False, blank=False)

    
    def __str__(self):
        return self.student_id

# class SystemDetectedEngagement(models.Model):
#     student_id = models.CharField(max_length=100, null=False, blank=False)
#     time_stamp = models.CharField(max_length=250, null=False, blank=False)
#     emotional_engagement = models.DecimalField(max_digits=3, decimal_places=2)
#     behavioral_engagement = models.DecimalField(max_digits=3, decimal_places=2)
#     cognitive_engagement = models.DecimalField(max_digits=3, decimal_places=2)
    
#     def __str__(self):
#         return self.student_id

class SystemDetectedEngagement(models.Model):
    timestamp = models.DateTimeField(null=True, blank=True, default=b'')
    participant_id = models.CharField(max_length=250, null=False, blank=False, default=b'')
    student_id = models.CharField(max_length=250, null=False, blank=False, default=b'')
    emotional_engagement = models.CharField(max_length=250, null=False, blank=False)
    behavioral_engagement = models.CharField(max_length=250, null=False, blank=False)
    cognitive_engagement = models.CharField(max_length=250, null=False, blank=False)

    def __str__(self):
        return f'Frame {self.id} ({self.timestamp})'