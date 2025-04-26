document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const parentId = this.getAttribute('data-parent-id');
            const modal = document.getElementById('replyModal');
            modal.style.display = 'block';
            document.getElementById('replyParentId').value = parentId;
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const replyForm = document.getElementById("replyForm");
    const replyModal = document.getElementById("replyModal");
    const formErrorsReply = document.getElementById("reply_file_error");

    if (replyForm) {
        replyForm.addEventListener("submit", function (e) {
            console.log('Submit event triggered for replyForm');
            handleReplyFormSubmit(e, replyForm, formErrorsReply, replyModal, (data) => {
                console.log('Data received:', data);
                const newReply = document.createElement("div");
                newReply.innerHTML = data.html;

                // Добавляем текст БЕЗПОСЕРЕДНЬОГО родительского комментария
                const replyToCommentBlock = document.createElement('blockquote');
                replyToCommentBlock.classList.add('reply-to-comment');
                replyToCommentBlock.textContent = data.parent_text;
                newReply.querySelector('.comment-text').insertAdjacentElement('beforebegin', replyToCommentBlock);

                const parentCommentCard = document.querySelector(`.comment-card[data-comment-id="${data.parent_id}"]`);
                if (parentCommentCard) {
                    const repliesContainer = parentCommentCard.querySelector('.replies');
                    if (repliesContainer) {
                        repliesContainer.prepend(newReply);
                        repliesContainer.style.display = 'block';
                    } else {
                        console.error('Container .replies not found in the parent comment card.');
                    }
                } else {
                    console.error('Parent comment card not found.');
                }
            });
        });
    } else {
        console.error('Element replyForm not found.');
    }

    // Функция для обработки отправки формы ответа
    function handleReplyFormSubmit(event, formElement, errorContainerElement, modalElement, successCallback) {
        event.preventDefault();
        const formData = new FormData(formElement);

        fetch(formElement.action, {
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
                successCallback(data);
                formElement.reset();
                if (modalElement) {
                    modalElement.style.display = "none";
                }
                errorContainerElement.innerHTML = "";
            } else {
                if (data.errors) {
                    let html = "";
                    const errors = typeof data.errors === 'string' ? JSON.parse(data.errors) : data.errors;
                    for (const field in errors) {
                        html += `<p>${errors[field].join("<br>")}</p>`;
                    }
                    errorContainerElement.innerHTML = html;
                } else {
                    errorContainerElement.innerHTML = "<p>An error occurred during reply submission.</p>";
                }
            }
        })
        .catch(error => {
            console.error("Reply fetch error:", error);
            errorContainerElement.innerHTML = `<p>Connection error during reply: ${error}</p>`;
        });
    }
});