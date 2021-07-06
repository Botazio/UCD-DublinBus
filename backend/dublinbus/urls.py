from django.urls import path
from dublinbus import views
from .views import current_user, UserList

urlpatterns = [
    path('', views.index, name='index'),
    path('stop/<str:stop_id>/', views.stop, name='stop'),
    path('route/<str:route_id>/', views.route, name='route'),
    path('stops/', views.stops, name='stops'),
    path('predict/', views.predict, name='predict'),
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
]
