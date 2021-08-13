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
    path('favoritestop/', views.FavoriteStopView.as_view()),
    path('favoritestop/<int:primary_key>/', views.FavoriteStopView.as_view()),
    path('favoritejourney/', views.FavoriteJourneyView.as_view()),
    path('favoritejourney/<int:primary_key>/', views.FavoriteJourneyView.as_view()),
    path('markers/', views.MarkerView.as_view()),
    path('markers/<int:primary_key>/', views.MarkerView.as_view()),
    path('theme/', views.ThemeView.as_view()),
    path('theme/<int:primary_key>/', views.ThemeView.as_view()),
    path('change_password/<int:pk>/', views.ChangePasswordView.as_view(), name='change_password'),
    path('lines/', views.lines, name='lines'),
    path('stops_by_trip/<str:trip_id>/', views.stops_by_trip, name='stops_by_trip'),
    path('shape_by_trip/<str:trip_id>/', views.shape_by_trip, name='shape_by_trip'),
    path('google/', views.GoogleSocialAuthView.as_view()),
    path('facebook/', views.FacebookSocialAuthView.as_view()),
]
