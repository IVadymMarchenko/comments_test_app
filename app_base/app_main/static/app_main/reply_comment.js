document.addEventListener('DOMContentLoaded', function () {
    // Обработка открытия модального окна для ответа
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const parentId = this.getAttribute('data-parent-id');
            const modal = document.getElementById('replyModal');
            modal.style.display = 'block';
            document.getElementById('replyParentId').value = parentId;
        });
    });

    const replyForm = document.getElementById("replyForm");
    const replyModal = document.getElementById("replyModal");
    const formErrorsReply = document.getElementById("reply_file_error");

    if (replyForm) {
        replyForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const formData = new FormData(replyForm);

            fetch(replyForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Reply server response:', data);
                if (data.success) {
                    const newReply = document.createElement("div");
                    newReply.innerHTML = data.html;

                    // Добавляем текст "Вы отвечаете на"
                    const replyToCommentBlock = document.createElement('blockquote');
                    replyToCommentBlock.classList.add('reply-to-comment');
                    replyToCommentBlock.textContent = data.parent_text;
                    newReply.querySelector('.comment-text').insertAdjacentElement('beforebegin', replyToCommentBlock);

                    // Найдем контейнер родительского комментария
                    const parentCommentCard = document.querySelector(`.comment-card[data-comment-id="${data.parent_id}"]`);
                    if (parentCommentCard) {
                        const repliesContainer = parentCommentCard.querySelector(`#replies-container-${data.parent_id}`);
                        if (repliesContainer) {
                            repliesContainer.style.display = 'block';

                            // Если контейнер для списка ответов еще не существует — создаем
                            let repliesListInner = repliesContainer.querySelector(`#replies-list-inner-${data.parent_id}`);
                            if (!repliesListInner) {
                                repliesListInner = document.createElement("div");
                                repliesListInner.id = `replies-list-inner-${data.parent_id}`;
                                repliesContainer.appendChild(repliesListInner);
                            }

                            repliesListInner.prepend(newReply);
                        } else {
                            console.error(`Replies container not found for parent ID ${data.parent_id}`);
                        }
                    } else {
                        console.error(`Parent comment card not found for ID ${data.parent_id}`);
                    }

                    replyForm.reset();
                    replyModal.style.display = "none";
                    formErrorsReply.innerHTML = "";
                } else {
                    // Показываем ошибки валидации
                    if (data.errors) {
                        let html = "";
                        const errors = typeof data.errors === 'string' ? JSON.parse(data.errors) : data.errors;
                        for (const field in errors) {
                            html += `<p>${errors[field].join("<br>")}</p>`;
                        }
                        formErrorsReply.innerHTML = html;
                    } else {
                        formErrorsReply.innerHTML = "<p>Произошла ошибка при отправке ответа.</p>";
                    }
                }
            })
            .catch(error => {
                console.error("Reply fetch error:", error);
                formErrorsReply.innerHTML = `<p>Ошибка соединения: ${error}</p>`;
            });
        });
    } else {
        console.error('Форма ответа не найдена.');
    }
});