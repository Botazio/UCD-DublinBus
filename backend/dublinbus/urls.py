from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('stop/<str:stop_id>/', views.stop, name='stop'),
    path('route/<str:route_id>/', views.route, name='route'),
]
