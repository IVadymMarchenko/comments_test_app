import time
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.cache import cache
from .models import Comment

@receiver(post_save, sender=Comment)
def clear_comment_cache(sender, instance, created, **kwargs):
    if created and instance.parent is None:
        # Засекаем время до сброса кеша
        start_time = time.perf_counter()

        try:
            # Пытаемся сбросить кеш всех страниц
            cache.delete_pattern("comments_page_*")
            print("✅ Сброшен кеш всех страниц комментариев")
        except AttributeError as err:
            # Если используем не django-redis
            print(f"Ошибка при сбросе кеша: {err}")

        # Засекаем время после выполнения операции
        end_time = time.perf_counter()

        # Выводим затраченное время
        print(f"⏱ Время сброса кеша всех страниц: {end_time - start_time:.4f} секунд")
