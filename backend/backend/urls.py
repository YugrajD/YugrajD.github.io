"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from app.api.views import signup, analyze_game_logs, plot_performance_trend, val_analyze_game_logs
from rest_framework.authtoken import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/signup/', signup, name='signup'),
    path('api/analyze/', analyze_game_logs, name='analyze_game_logs'),
    path('api/valanalyze/', val_analyze_game_logs, name='val_analyze_game_logs'),
    path('api/plot/', plot_performance_trend, name='plot_performance_trend'),
    path('api-token-auth/', views.obtain_auth_token),
    path('', include('app.api.urls')),
]
