from PIL import Image
from django.core.files.base import ContentFile




def resize_image_pillow(image_file, max_width=320, max_height=240):
    """
    Уменьшает изображение Pillow ImageFile, если оно больше заданных размеров,
    сохраняя пропорции и возвращая ContentFile.
    """
    try:
        img = Image.open(image_file)
        width, height = img.size

        if width > max_width or height > max_height:
            aspect_ratio = width / height
            if aspect_ratio > max_width / max_height:
                new_width = max_width
                new_height = int(new_width / aspect_ratio)
            else:
                new_height = max_height
                new_width = int(new_height * aspect_ratio)

            resized_img = img.resize((new_width, new_height))

            # Создаем ContentFile из уменьшенного изображения
            from io import BytesIO
            buffer = BytesIO()
            resized_img.save(buffer, img.format)
            return ContentFile(buffer.getvalue(), name=image_file.name)
        return image_file
    except Exception as e:
        print(f"Ошибка при обработке изображения: {e}")
        return image_file


