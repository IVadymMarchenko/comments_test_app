import json
from django.shortcuts import render
from .forms import CommentForm
from .models import Comment
from django.shortcuts import render
from django.template.loader import render_to_string
from django.http import JsonResponse
from .forms import CommentForm
from .models import Comment




def add(request):
    form = CommentForm()
    comments = Comment.objects.filter(parent__isnull=True)

    if request.method == 'POST':
        form = CommentForm(request.POST, request.FILES)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.user = request.user  # Присваиваем текущего пользователя
            comment.save()

            # Рендерим HTML для нового комментария
            html = render_to_string("app_comments/single_comment.html", {"comment": comment})
            return JsonResponse({"success": True, "html": html})

        else:
            # Если форма не валидна, отправляем ошибки
            errors = {}
            for field, error in form.errors.items():
                errors[field] = error
            return JsonResponse({"success": False, "errors": json.dumps(errors)})

    return render(request, 'app_comments/comments.html', {'form': form, 'comments': comments})




def add_reply(request):
    if request.method == 'POST':
        form = CommentForm(request.POST, request.FILES)
        if form.is_valid():
            parent_id = request.POST.get('parent_id')
            try:
                parent_comment = Comment.objects.get(id=parent_id)
            except Comment.DoesNotExist:
                return JsonResponse({"success": False, "errors": {"parent": ["Родительский комментарий не найден."]}})

            reply = form.save(commit=False)
            reply.user = request.user
            reply.parent_id = parent_id
            reply.save()

            # Отримуємо текст БЕЗПОСЕРЕДНЬОГО батьківського коментаря
            parent_text = parent_comment.text

            # Рендерим HTML только что добавленного ответа
            html = render_to_string("app_comments/single_comment.html", {"comment": reply})
            return JsonResponse({"success": True, "html": html, "parent_id": parent_id, "parent_text": parent_text})
        else:
            errors_dict = {}
            for field, error_list in form.errors.items():
                errors_dict[field] = [str(e) for e in error_list]
            return JsonResponse({"success": False, "errors": errors_dict})
    return JsonResponse({"success": False, "errors": ["Недопустимый метод запроса."]})