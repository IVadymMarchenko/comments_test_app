document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("commentForm");
    const modal = document.getElementById("commentModal");
    const errorContainer = document.getElementById("formErrors");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); 

        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST",
            body: formData,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            if (data.success) {
                
                const newComment = document.createElement("div");
                newComment.innerHTML = data.html;
                document.getElementById("comments-container").prepend(newComment);

                // Очищаем форму
                form.reset();

                // Закрываем модалку
                modal.style.display = "none";

                // Очищаем ошибки
                errorContainer.innerHTML = "";
            } else {
                // Если ошибки — показываем
                if (data.errors) {
                    const errors = JSON.parse(data.errors);
                    let html = "";
                    for (const field in errors) {
                        html += `<p>${errors[field].join("<br>")}</p>`;
                    }
                    errorContainer.innerHTML = html;
                } else {
                    errorContainer.innerHTML = "<p>There was an error sending</p>";
                }
            }
        })
        .catch(error => {
            console.error("Ошибка:", error);
            errorContainer.innerHTML = "<p>To post comments you need to register or log in</p>";
        });
    });
});