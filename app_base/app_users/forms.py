from django import forms
from django.contrib.auth.forms import AuthenticationForm,UserCreationForm
from django.contrib.auth import get_user_model
from .models import CustomUser
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError





class UserRegisterForm(UserCreationForm):
    avatar = forms.ImageField(
        required=False, 
        label="Avatar (Optional)"
    )
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'homepage', 'password1', 'password2', 'avatar']

    def clean_avatar(self):
        avatar = self.cleaned_data.get('avatar')
        
        if avatar:
            file_size = avatar.size
            limit = 3 * 1024 * 1024  # 3 MB in bytes
            if file_size > limit:
                raise ValidationError("The file size must not exceed 3 MB.")
        
        return avatar




class UserLoginForm(forms.Form):
    email = forms.EmailField(label="Email", max_length=100)
    password = forms.CharField(widget=forms.PasswordInput, label="Password")

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super().__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')
        user = authenticate(request=self.request, email=email, password=password)
        if not user:
            raise ValidationError("Invalid email or password.")  # Ошибка попадёт в non_field_errors
        self.user = user
        return cleaned_data

    def get_user(self):
        return self.user