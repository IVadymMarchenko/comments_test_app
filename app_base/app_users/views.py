from django.shortcuts import redirect
from django.views.generic.edit import FormView
from django.views import View
from django.http import JsonResponse, HttpResponseRedirect, HttpRequest, HttpResponse
from django.urls import reverse_lazy, reverse
from django.contrib.auth import authenticate, login as auth_login
from .forms import UserRegisterForm, UserLoginForm
from django.contrib import auth, messages
from django.contrib.auth.decorators import login_required

class RegistrationView(FormView):
    """
    Вью для регистрации пользователя.
    Использует Django FormView для обработки формы регистрации.
    """

    form_class = UserRegisterForm  # Форма, используемая для регистрации
    success_url = reverse_lazy('main:main')  # URL для перенаправления после успешной регистрации

    def form_valid(self, form: UserRegisterForm) -> JsonResponse:
        """
        Метод вызывается при успешной валидации формы.
        Сохраняет пользователя и возвращает JSON-ответ об успехе.
        """
        user = form.save()  # Сохраняем пользователя в БД
        messages.success(self.request, 'Registration was successful please login ')
        return JsonResponse({
            'success': True,
            'message': 'Registration successful',
            'redirect': self.success_url  # URL для редиректа (на фронте)
        }, status=200)

    def form_invalid(self, form: UserRegisterForm) -> JsonResponse:
        """
        Метод вызывается при неуспешной валидации формы.
        Возвращает JSON с ошибками формы.
        """
        return JsonResponse({'errors': form.errors.as_json()}, status=400)



class LoginView(View):
    """
    Вью для авторизации пользователя.
    Обрабатывает POST-запросы с формой входа.
    """

    def post(self, request: HttpRequest, *args, **kwargs) -> HttpResponse:
        """
        Принимает данные формы, валидирует их,
        аутентифицирует пользователя и логинит его.
        В случае ошибки возвращает JSON с ошибками.
        """
        form = UserLoginForm(request.POST)

        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            # Пытаемся аутентифицировать пользователя
            user = authenticate(request, email=email, password=password)

            if user:
                # Успешная аутентификация — логиним пользователя
                auth_login(request, user)
                messages.success(request, "You have successfully logged in!")
                return HttpResponseRedirect(reverse('main:main'))

        # Если форма невалидна — возвращаем ошибки
        return JsonResponse({'errors': form.errors.as_json()}, status=400)




@login_required
def logout(request):
    auth.logout(request)
    return redirect(reverse('main:main'))