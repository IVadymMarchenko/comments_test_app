
import re



def convert_special_tags_to_html( text):

    """Преобразует специальные теги в HTML."""
    text = re.sub(r'\[i\](.*?)\[\/i\]', r'<em>\1</em>', text)
    text = re.sub(r'\[strong\](.*?)\[\/strong\]', r'<strong>\1</strong>', text)
    text = re.sub(r'\[code\](.*?)\[\/code\]', r'<code>\1</code>', text)
    text = re.sub(r'\[a href="(.*?)"](.*?)\[\/a\]', r'<a href="\1">\2</a>', text)
    return text