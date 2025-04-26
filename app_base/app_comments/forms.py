from django import forms
from .models import Comment
from django.core.exceptions import ValidationError


class CommentForm(forms.ModelForm):
    text = forms.CharField(widget=forms.Textarea)
    image = forms.FileField(required=False)
    parent_id = forms.IntegerField(widget=forms.HiddenInput, required=False)

    class Meta:
        model = Comment
        fields = ['text', 'image']

    def clean_image(self):
        image = self.cleaned_data.get('image')

        if image:
            file_size = image.size

            if image.name.endswith(('.jpg', '.jpeg', '.png', '.gif')):
                limit = 3 * 1024 * 1024  # 3 MB in bytes для изображений
                if file_size > limit:
                    raise ValidationError("The image size must not exceed 3 MB!!!.")
            elif image.name.endswith('.txt'):
                limit = 100 * 1024  # 100 KB in bytes для текстовых файлов
                if file_size > limit:
                    raise ValidationError("The size of the text file should not exceed 100 KB")
                    
        return image

