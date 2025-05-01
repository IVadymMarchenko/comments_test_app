from django.urls import path
from django.views.decorators.cache import cache_page
from . import views



app_name = 'user'


urlpatterns = [
     path("registration/",  views.RegistrationView.as_view(), name="registr"), 
     path("login/",  views.LoginView.as_view(), name="login"),
     path("logout/",  views.logout, name="logout"), 
]