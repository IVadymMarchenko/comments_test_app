document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('htmx:beforeRequest', function(evt) {
        const target = evt.target;
        if (target.classList.contains('load-more-container')) {
            // Удаляем текущую кнопку "Load more" перед загрузкой следующей страницы
            target.remove();
        }
    });
});