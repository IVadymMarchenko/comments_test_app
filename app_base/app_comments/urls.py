from django.urls import path
from django.views.decorators.cache import cache_page
from . import views



app_name = 'comment'


urlpatterns = [
    path('add-comment/', views.AddCommentView.as_view(), name='add_comment'),
    path('reply/', views.AddReplyView.as_view(), name='reply_comment'),
    path('get-replies/<int:comment_id>/', views.CommentRepliesView.as_view(), name='load_replies'),
    path('delete/<int:comment_id>/', views.DeleteCommentView.as_view(), name='delete_comment'),
    
]