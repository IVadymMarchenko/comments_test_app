from django.shortcuts import render
from django.views import View
from app_comments.models import Comment
from django.core.paginator import Paginator
from .order_by import sort_options
from django.core.cache import cache


class CommentListView(View):

    def get(self, request, *args, **kwargs):
        # Получаем сортировку из запроса
        sort_by = request.GET.get('sort_by', '-dateAdded')
        order_by = sort_options.get(sort_by, '-created_at')

        
        page_number = request.GET.get('page', 1)
        cache_key = f'comments_page_{page_number}_sort_{sort_by}'

       
        comments = cache.get(cache_key)

        if not comments:
           
            comments_query = Comment.objects.filter(parent__isnull=True).select_related('user').order_by(order_by)
            paginator = Paginator(comments_query, 5)
            page_obj = paginator.get_page(page_number)

           
            cache.set(cache_key, page_obj, timeout=60) 
        else:
            page_obj = comments

        return render(request, "app_main/base.html", {
            'comments': page_obj,
            'sort_by': sort_by
        })
