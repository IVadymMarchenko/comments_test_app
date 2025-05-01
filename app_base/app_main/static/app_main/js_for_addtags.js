function previewComment() {
    const commentText = document.getElementById('commentText').value;
    const previewContent = document.getElementById('commentPreviewContent');

    let previewHTML = commentText.replace(/\[i\](.*?)\[\/i\]/gs, '<em>$1</em>');
    previewHTML = previewHTML.replace(/\[strong\](.*?)\[\/strong\]/gs, '<strong>$1</strong>');
    previewHTML = previewHTML.replace(/\[code\](.*?)\[\/code\]/gs, '<code>$1</code>');
    previewHTML = previewHTML.replace(/\[a href="(.*?)"](.*?)\[\/a\]/gs, '<a href="$1">$2</a>');

    previewContent.innerHTML = previewHTML;
}

function insertTag(tagStart, tagEnd, elementId) {
    const element = document.getElementById(elementId);
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;
    const scrollTop = element.scrollTop;
    const selectedText = element.value.substring(startPos, endPos);
    const replacementText = tagStart + selectedText + tagEnd;

    element.value = element.value.substring(0, startPos) + replacementText + element.value.substring(endPos, element.value.length);

    // Встановлюємо позицію курсора всередину тегів
    const cursorPosition = startPos + tagStart.length + selectedText.length / 2; // Приблизно посередині
    element.selectionStart = cursorPosition;
    element.selectionEnd = cursorPosition;

    element.scrollTop = scrollTop;
    element.focus();
    previewComment();
}

function insertLink() {
    const element = document.getElementById('commentText');
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;
    const scrollTop = element.scrollTop;
    const selectedText = element.value.substring(startPos, endPos);
    const linkTemplate = `[a href=""]${selectedText}[/a]`;

    element.value = element.value.substring(0, startPos) + linkTemplate + element.value.substring(endPos, element.value.length);

    // Встановлюємо позицію курсора всередину лапок URL
    const cursorPosition = startPos + '[a href="'.length;
    element.selectionStart = cursorPosition;
    element.selectionEnd = cursorPosition;

    element.scrollTop = scrollTop;
    element.focus();
    previewComment();
}







function insertTag(tagStart, tagEnd, elementId) {
    const element = document.getElementById(elementId);
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;
    const scrollTop = element.scrollTop;
    const selectedText = element.value.substring(startPos, endPos);
    const replacementText = tagStart + selectedText + tagEnd;

    element.value = element.value.substring(0, startPos) + replacementText + element.value.substring(endPos, element.value.length);

    const cursorPosition = startPos + tagStart.length + selectedText.length / 2;
    element.selectionStart = cursorPosition;
    element.selectionEnd = cursorPosition;

    element.scrollTop = scrollTop;
    element.focus();
    // previewComment() - Попередній перегляд для відповідей може бути іншим або не потрібним
}

function insertLink(elementId) {
    const element = document.getElementById(elementId);
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;
    const scrollTop = element.scrollTop;
    const selectedText = element.value.substring(startPos, endPos);
    const linkTemplate = `[a href=""]${selectedText}[/a]`;

    element.value = element.value.substring(0, startPos) + linkTemplate + element.value.substring(endPos, element.value.length);

    const cursorPosition = startPos + '[a href="'.length;
    element.selectionStart = cursorPosition;
    element.selectionEnd = cursorPosition;

    element.scrollTop = scrollTop;
    element.focus();
    //previewComment() - Попередній перегляд для відповідей може бути іншим або не потрібним
}