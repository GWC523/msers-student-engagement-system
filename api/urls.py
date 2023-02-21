from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverview, name='apiOverview'),
    path('student-list/', views.ShowAllStudent, name='student-list'),
    path('student-detail/<int:pk>/', views.ViewStudent, name='student-detail'),
    path('student-create/', views.CreateStudent, name='student-create'),
    path('student-update/<int:pk>/', views.UpdateStudent, name='student-update'),
    path('student-delete/<int:pk>/', views.DeleteStudent, name='student-delete'),
    path('selfreport-list/', views.ShowAllSelfReport, name='selfreport-list'),
    path('selfreport-detail/<int:pk>/', views.ViewSelfReport, name='selfreport-detail'),
    path('selfreport-create/', views.CreateSelfReport, name='selfreport-create'),
    path('selfreport-update/<int:pk>/', views.UpdateSelfReport, name='selfreport-update'),
    path('selfreport-delete/<int:pk>/', views.DeleteSelfReport, name='selfreport-delete'),
    path('systemdetected-list/', views.ShowAllSystemDetected, name='systemdetected-list'),
    path('systemdetected-detail/<int:pk>/', views.ViewSystemDetected, name='systemdetected-detail'),
    path('systemdetected-create/', views.CreateSystemDetected, name='systemdetected-create'),
    path('systemdetected-update/<int:pk>/', views.UpdateSystemDetected, name='systemdetected-update'),
    path('systemdetected-delete/<int:pk>/', views.DeleteSystemDetected, name='systemdetected-delete'),
]