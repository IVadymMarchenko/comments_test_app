import json
from django.shortcuts import render, redirect
from .forms import CommentForm
from .models import Comment
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, get_object_or_404




from django.shortcuts import render, redirect
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
        parent_id = request.POST.get('parent_id')
        text = request.POST.get('text')
        image = request.FILES.get('file')  # если прикреплён файл
        parent_comment = get_object_or_404(Comment, id=parent_id)

        Comment.objects.create(
            user=request.user,
            text=text,
            parent=parent_comment,
            image=image if image else None
        )
    return redirect(request.META.get('HTTP_REFERER', '/'))