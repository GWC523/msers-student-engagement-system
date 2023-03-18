from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverview, name='apiOverview'),
    path('student-list/', views.ShowAllStudent, name='student-list'),
    path('student-detail/<int:pk>/', views.ViewStudent, name='student-detail'),
    path('student-create/', views.CreateStudent, name='student-create'),
    path('student-update/<int:pk>/', views.UpdateStudent, name='student-update'),
    path('student-delete/<int:pk>/', views.DeleteStudent, name='student-delete'),

    path('engagement-list/', views.ShowAllSelfReportEngagement, name='engagement-list'),
    path('engagement-detail/<int:pk>/', views.ViewSelfReportEngagement, name='engagement-detail'),
    path('engagement-create/', views.CreateSelfReportEngagement, name='engagement-create'),
    path('engagement-update/<int:pk>/', views.UpdateSelfReportEngagement, name='engagement-update'),
    path('engagement-delete/<int:pk>/', views.DeleteSelfReportEngagement, name='engagement-delete'),

    path('selfreport-info-list/', views.ShowAllSelfReportInfo, name='selfreport-info-list'),
    path('selfreport-info-detail/<int:pk>/', views.ViewSelfReportInfo, name='selfreport-info-detail'),
    path('selfreport-info-create/', views.CreateSelfReportInfo, name='selfreport-info-create'),
    path('selfreport-info-update/<int:pk>/', views.UpdateSelfReportInfo, name='selfreport-info-update'),
    path('selfreport-info-delete/<int:pk>/', views.DeleteSelfReportInfo, name='selfreport-info-delete'),

    path('systemdetected-list/', views.ShowAllSystemDetected, name='systemdetected-list'),
    path('systemdetected-detail/<int:pk>/', views.ViewSystemDetected, name='systemdetected-detail'),
    path('systemdetected-create/', views.CreateSystemDetected, name='systemdetected-create'),
    path('systemdetected-update/<int:pk>/', views.UpdateSystemDetected, name='systemdetected-update'),
    path('systemdetected-delete/<int:pk>/', views.DeleteSystemDetected, name='systemdetected-delete'),
    path('student-engagement-create/', views.DetermineEngagement, name='student-engagement-create'),

]