from django.urls import path
from django.views.decorators.cache import cache_page
from . import views



app_name = 'comment'


urlpatterns = [
    path('add-comment/', views.add, name='add_comment'),
    path('reply/', views.add_reply, name='reply_comment'),
]