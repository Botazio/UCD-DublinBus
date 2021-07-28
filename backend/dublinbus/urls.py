from django.urls import path
from dublinbus import views

urlpatterns = [
    path('', views.index, name='index'),
    path('stop/<str:stop_id>/', views.stop, name='stop'),
    path('route/<str:route_id>/', views.route, name='route'),
    path('stops/', views.stops, name='stops'),
    path('predict/', views.Predict.as_view(), name='predict'),
    path('users/', views.UserView.as_view()),
    path('users/<int:primary_key>/', views.UserView.as_view()),
    path('favouritestop/', views.FavouriteStopView.as_view()),
    path('favouritestop/<int:primary_key>/', views.FavouriteStopView.as_view()),
    path('favouritejourney/', views.FavouriteJourneyView.as_view()),
    path('favouritejourney/<int:primary_key>/', views.FavouriteJourneyView.as_view()),
]
