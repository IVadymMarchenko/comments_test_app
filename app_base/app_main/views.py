from django.shortcuts import render, HttpResponse
from django.template import loader
from django.views import View
from app_comments.models import Comment




class CommentListView(View):
    
    def get(self, request, *args, **kwargs):
        template = loader.get_template("app_main/base.html") # Змінено на ваш шаблон
        comments = Comment.objects.all().order_by('-created_at') # Додано сортування
        context = {
            "comments": comments,
        }
        return HttpResponse(template.render(context, request)) # Я явно передаю request
