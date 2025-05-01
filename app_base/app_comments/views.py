import json
from django.shortcuts import render
from django.views.generic import CreateView
from .forms import CommentForm
from .models import Comment
from django.shortcuts import render
from django.template.loader import render_to_string
from django.http import JsonResponse
from .forms import CommentForm
from .models import Comment
from app_base import settings
import bleach
from .utils import convert_special_tags_to_html
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render
from django.views import View
from .models import Comment


class AddCommentView(CreateView):
    """
    Класс для добавления комментария на главную страницу через CreateView.
    """
    model = Comment
    form_class = CommentForm

    def form_valid(self, form):
        """
        Если форма валидна, сохраняем комментарий и возвращаем JSON с HTML.
        """
        comment = form.save(commit=False)
        comment.user = self.request.user

        # 1. Преобразуем специальные теги в HTML
        cleaned_text = convert_special_tags_to_html(comment.text)

        # 2. Очищаем полученный HTML с bleach, разрешая нужные теги
        cleaned_text = bleach.clean(cleaned_text, tags=settings.ALLOWED_TAGS, attributes=settings.ALLOWED_ATTRIBUTES)

        comment.text = cleaned_text
        comment.save()

        html = render_to_string("app_comments/single_comment.html", {"comment": comment}, request=self.request)

        return JsonResponse({
            "success": True,
            "html": html
        })

    def form_invalid(self, form):
        """
        Если форма невалидна, отправляем ошибки в JSON.
        """
        errors = {}
        for field, error in form.errors.items():
            errors[field] = error
        return JsonResponse({"success": False, "errors": json.dumps(errors)})





class AddReplyView(CreateView):
    """
    Класс для добавления ответа на комментарий.
    """
    model = Comment
    form_class = CommentForm

    def form_valid(self, form):
        """
        Если форма валидна, сохраняем ответ и возвращаем JSON с HTML.
        """
        parent_id = self.request.POST.get('parent_id')
        
        try:
            parent_comment = Comment.objects.get(id=parent_id)
        except Comment.DoesNotExist:
            return JsonResponse({"success": False, "errors": {"parent": ["Родительский комментарий не найден."]}}, status=400)

        # Создаём новый ответ
        reply = form.save(commit=False)
        reply.user = self.request.user
        cleaned_text = convert_special_tags_to_html(reply.text)
        cleaned_text = bleach.clean(cleaned_text, tags=settings.ALLOWED_TAGS, attributes=settings.ALLOWED_ATTRIBUTES) #фильтруем теги
        reply.text = cleaned_text

        reply.parent_id = parent_id
        reply.save()
        # Получаем текст родительского комментария
        parent_text = parent_comment.text
        clean_parent_text = bleach.clean(parent_text)
        # Рендерим HTML только что добавленного ответа
        html = render_to_string("app_comments/single_comment.html", {"comment": reply}, request=self.request)

        return JsonResponse({
            "success": True,
            "html": html,
            "parent_id": parent_id,
            "parent_text": clean_parent_text
        })

    def form_invalid(self, form):
        """
        Если форма невалидна, отправляем ошибки в JSON.
        """
        errors_dict = {}
        for field, error_list in form.errors.items():
            errors_dict[field] = [str(e) for e in error_list]
        return JsonResponse({"success": False, "errors": errors_dict}, status=400)


# app_comments/views.py
class CommentRepliesView(View):
    def get(self, request, comment_id):
        parent_comment = get_object_or_404(Comment, id=comment_id)
        replies = parent_comment.replies.all().order_by('-created_at')
        page_number = int(request.GET.get('page', 1))
        paginator = Paginator(replies, 2)  # Количество ответов на странице
        page_obj = paginator.get_page(page_number)
        initial_load = request.GET.get('initial_load', False)

        context = {
            'replies': page_obj,
            'parent_id': comment_id,
            'page_number': page_number,
        }

        return render(request, 'app_comments/replies_list.html', context)

            





















#def add(request):
    #form = CommentForm()
    #if request.method == 'POST':
        #form = CommentForm(request.POST, request.FILES)
        #if form.is_valid():
            #comment = form.save(commit=False)
            #comment.user = request.user  
            #comment.save()

            # Рендерим HTML для нового комментария
            #html = render_to_string("app_comments/single_comment.html", {"comment": comment})
            #return JsonResponse({"success": True, "html": html})

        #else:
            # Если форма не валидна, отправляем ошибки
            #errors = {}
            #for field, error in form.errors.items():
                #errors[field] = error
            #return JsonResponse({"success": False, "errors": json.dumps(errors)})








#def add_reply(request):
    #if request.method == 'POST':
        #form = CommentForm(request.POST, request.FILES)
        #if form.is_valid():
            #parent_id = request.POST.get('parent_id')
            #try:
                #parent_comment = Comment.objects.get(id=parent_id)
            #except Comment.DoesNotExist:
                #return JsonResponse({"success": False, "errors": {"parent": ["Родительский комментарий не найден."]}})

            #reply = form.save(commit=False)
            #reply.user = request.user
            #reply.parent_id = parent_id
            #reply.save()

            # Отримуємо текст БЕЗПОСЕРЕДНЬОГО батьківського коментаря
            #parent_text = parent_comment.text

            # Рендерим HTML только что добавленного ответа
            #html = render_to_string("app_comments/single_comment.html", {"comment": reply})
            #return JsonResponse({"success": True, "html": html, "parent_id": parent_id, "parent_text": parent_text})
        #else:
            #errors_dict = {}
            #for field, error_list in form.errors.items():
                #errors_dict[field] = [str(e) for e in error_list]
            #return JsonResponse({"success": False, "errors": errors_dict})
    #return JsonResponse({"success": False, "errors": ["Недопустимый метод запроса."]})