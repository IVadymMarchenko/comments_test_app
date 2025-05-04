import time
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Comment

@receiver(post_save, sender=Comment)
def clear_comment_cache(sender, instance, created, **kwargs):
    if created and instance.parent is None: 
        start_time = time.perf_counter()
        try:   
            cache.delete_pattern("comments_page_*")
            print("✅ Сброшен кеш всех страниц комментариев")
        except AttributeError as err:
          
            print(f"Ошибка при сбросе кеша: {err}")
        end_time = time.perf_counter()
        print(f"⏱ Время сброса кеша всех страниц: {end_time - start_time:.4f} секунд")


@receiver(post_delete, sender=Comment)
def clear_comment_cache_on_delete(sender, instance, **kwargs):
    """
    Очищает кеш всех страниц комментариев после удаления корневого комментария.
    """
    if instance.parent is None:
        start_time = time.perf_counter()
        try:
            cache.delete_pattern("comments_page_*")
            print("🗑️ Сброшен кеш всех страниц комментариев (после удаления)")
        except AttributeError as err:
            print(f"⚠️ Ошибка при сбросе кеша (после удаления): {err}")
        end_time = time.perf_counter()
        print(f"⏱ Время сброса кеша всех страниц (после удаления): {end_time - start_time:.4f} секунд")
