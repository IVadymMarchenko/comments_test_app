from django.shortcuts import render
from django.views import View
from app_comments.models import Comment
from django.core.paginator import Paginator
from .order_by import sort_options




class CommentListView(View):

    
    def get(self, request, *args, **kwargs):
        sort_by = request.GET.get('sort_by', '-dateAdded')
        order_by = sort_options.get(sort_by, '-created_at')

        comments_query = Comment.objects.filter(parent__isnull=True).select_related('user').order_by(order_by)

        paginator = Paginator(comments_query, 5)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        return render(request, "app_main/base.html", {
            'comments': page_obj,
            'sort_by': sort_by
        })

            