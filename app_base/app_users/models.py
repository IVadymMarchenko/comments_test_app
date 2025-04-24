from django.db import models

from django.contrib.auth.models import AbstractUser
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError

class CustomUser(AbstractUser):
    username = models.CharField(max_length=100, unique=False,verbose_name='username')
    email = models.EmailField(max_length=100,unique=True,verbose_name='email')
    homepage = models.URLField(max_length=200,verbose_name='home-page')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)  # Аватар пользователя

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    

    class Meta:
        db_table = 'user'
        verbose_name = 'users'
        verbose_name_plural = 'users'

    def __str__(self):
        return self.email