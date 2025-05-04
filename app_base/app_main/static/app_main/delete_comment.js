document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("delete-comment-btn")) {
            const commentId = e.target.dataset.commentId;
            const commentElement = document.getElementById(`comment-${commentId}`);

            if (confirm("Ви впевнені, що хочете видалити цей коментар?")) {
                fetch(`/comments/delete/${commentId}/`, {
                    method: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRFToken": getCookie("csrftoken")
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Відповідь видалення:", data);
                    if (data.success) {
                        if (commentElement) {
                            commentElement.remove();
                            console.log(data.message);
                        } else {
                            console.warn(`Елемент коментаря з ID ${commentId} не знайдено в DOM.`);
                        }
                    } else {
                        console.error("Помилка видалення:", data.error);
                        alert(data.error);
                    }
                })
                .catch(error => {
                    console.error("Помилка запиту на видалення:", error);
                    alert("Виникла помилка при спробі видалити коментар.");
                });
            }
        }
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});