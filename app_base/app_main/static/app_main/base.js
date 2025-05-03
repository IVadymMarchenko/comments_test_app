
// Функция для переключения видимости ответов
function toggleReplies(btn) {
  const replies = btn.parentElement.nextElementSibling;
  const commentId = btn.dataset.commentId; // Получаем ID комментария из data-атрибута

  // Проверяем, сохранен ли уже исходный текст кнопки
  if (!btn.dataset.originalText) {
      btn.dataset.originalText = btn.innerHTML; // Сохраняем исходный HTML
  }

  // Проверка текущего состояния отображения
  if (replies.style.display === 'none') {
      replies.style.display = 'block';
      btn.textContent = 'Hide answers';
  } else {
      replies.style.display = 'none';
      btn.innerHTML = btn.dataset.originalText; // Восстанавливаем исходный HTML
  }
}
  
  // Открытие модального окна для ответа
  function openReplyModal() {
    document.getElementById('replyModal').style.display = 'block';
  }
  
  // Закрытие модального окна при клике вне его
  window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = "none";
    }
  };
  
  // Обработчик изменения файла (для изображений и текстовых файлов)
  document.getElementById('replyFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('previewContainerReply');
    previewContainer.innerHTML = ''; // Очищаем предыдущее содержимое
  
    if (!file) return;
  
    const fileType = file.type;
  
    // Проверка формата изображения
    if (fileType.startsWith('image/')) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(fileType)) {
        alert('Допустимые форматы: JPG, PNG, GIF');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const MAX_WIDTH = 320;
          const MAX_HEIGHT = 240;
          let width = img.width;
          let height = img.height;
  
          // Масштабирование изображения
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width *= scale;
            height *= scale;
          }
  
          // Создание canvas для предпросмотра
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
  
          // Получаем data URL и добавляем в Lightbox
          const dataUrl = canvas.toDataURL(fileType);
          const link = document.createElement('a');
          link.href = dataUrl;
          link.setAttribute('data-lightbox', 'preview');
          link.innerHTML = `<img src="${dataUrl}" style="max-width:100%;max-height:75px;border:1px solid #ccc;margin-top:10px">`;
          previewContainer.appendChild(link);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  
    // Обработка текстового файла
    else if (fileType === 'text/plain') {
      if (file.size > 100 * 1024) {
        alert('Максимальный размер текстового файла: 100KB');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = function(e) {
        const pre = document.createElement('pre');
        pre.textContent = e.target.result;
        pre.style.cssText = "background:#f4f4f4;padding:10px;border:1px solid #ccc;margin-top:10px;max-height:200px;overflow:auto;";
        previewContainer.appendChild(pre);
      };
      reader.readAsText(file);
    } else {
      alert('Допустимы только изображения JPG/PNG/GIF и текстовые файлы .txt');
    }
  });
  
  // Обработчик изменения файла (для основных изображений)
  document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = ''; // Очищаем предыдущее содержимое
  
    if (!file) return;
  
    const fileType = file.type;
  
    if (fileType.startsWith('image/')) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(fileType)) {
        alert('Допустимые форматы: JPG, PNG, GIF');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const MAX_WIDTH = 320;
          const MAX_HEIGHT = 240;
          let width = img.width;
          let height = img.height;
  
          // Масштабируем изображение
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width *= scale;
            height *= scale;
          }
  
          // Создаем canvas для предпросмотра
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
  
          // Добавляем изображение в Lightbox
          const dataUrl = canvas.toDataURL(fileType);
          const link = document.createElement('a');
          link.href = dataUrl;
          link.setAttribute('data-lightbox', 'preview');
          link.innerHTML = `<img src="${dataUrl}" style="max-width:100%;max-height:75px;border:1px solid #ccc;margin-top:10px">`;
          previewContainer.appendChild(link);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  
    // Текстовый файл
    else if (fileType === 'text/plain') {
      if (file.size > 100 * 1024) {
        alert('Максимальный размер текстового файла: 100KB');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = function(e) {
        const pre = document.createElement('pre');
        pre.textContent = e.target.result;
        pre.style.cssText = "background:#f4f4f4;padding:10px;border:1px solid #ccc;margin-top:10px;max-height:200px;overflow:auto;";
        previewContainer.appendChild(pre);
      };
      reader.readAsText(file);
    } else {
      alert('Допустимы только изображения JPG/PNG/GIF и текстовые файлы .txt');
    }
  });
  
  // Очищаем для добавления нового файла
  const fileInput = document.getElementById('fileInput');
  const fileNameDisplay = document.getElementById('file-name');
  const removeFileButton = document.getElementById('remove-file');
  const previewContainer = document.getElementById('previewContainer');
  
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      fileNameDisplay.textContent = file.name;
      removeFileButton.style.display = 'inline-block';
    } else {
      fileNameDisplay.textContent = 'Файл не выбран';
      removeFileButton.style.display = 'none';
    }
    previewContainer.innerHTML = ''; // Очищаем предпросмотр
  });
  
  // Обработчик кнопки удаления файла
  removeFileButton.addEventListener('click', function() {
    fileInput.value = '';
    fileNameDisplay.textContent = 'Файл не выбран';
    removeFileButton.style.display = 'none';
    previewContainer.innerHTML = '';
  });
  
  // Для обработки ответов с файлами
  const replyFileInput = document.getElementById('replyFileInput');
  const replyFileNameDisplay = document.getElementById('reply-file-name');
  const removeReplyFileButton = document.getElementById('remove-reply-file');
  const previewContainerReply = document.getElementById('previewContainerReply');
  
  replyFileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      replyFileNameDisplay.textContent = file.name;
      removeReplyFileButton.style.display = 'inline-block';
    } else {
      replyFileNameDisplay.textContent = 'Файл не выбран';
      removeReplyFileButton.style.display = 'none';
    }
    previewContainerReply.innerHTML = '';
  });
  
  // Обработчик удаления файла ответа
  removeReplyFileButton.addEventListener('click', function() {
    replyFileInput.value = '';
    replyFileNameDisplay.textContent = 'Файл не выбран';
    removeReplyFileButton.style.display = 'none';
    previewContainerReply.innerHTML = '';
  });
  
  // Функции для открытия/закрытия модальных окон
  function openModal(id) {
    document.getElementById(id).style.display = 'block';
  }
  
  function closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }
  
  function outsideClick(event, id) {
    if (event.target.id === id) {
      closeModal(id);
    }
  }
  
  function switchModal(currentId, targetId) {
    closeModal(currentId);
    openModal(targetId);
  }
  
  // Обработчик изменения аватара
  document.getElementById('avatarInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('previewContainerAvatar');
    const fileNameDisplay = document.getElementById('avatar-file-name');
    const removeFileButton = document.getElementById('remove-avatar-file');
  
    previewContainer.innerHTML = ''; 
    if (!file) return;
  
    fileNameDisplay.textContent = file.name;
    removeFileButton.style.display = 'inline';
  
    const fileType = file.type;
  
    if (fileType.startsWith('image/')) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(fileType)) {
        alert('Допустимые форматы: JPG, PNG, GIF');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = function(e) {
        const dataUrl = e.target.result;
        const link = document.createElement('a');
        link.href = dataUrl;
        link.setAttribute('data-lightbox', 'preview');
        link.innerHTML = `<img src="${dataUrl}" style="max-width:100%;max-height:75px;border:1px solid #ccc;margin-top:10px">`;
        previewContainer.appendChild(link);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Допустимы только изображения JPG/PNG/GIF');
    }
  });
  
  // Удаление аватара
  document.getElementById('remove-avatar-file').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('avatarInput').value = '';
    document.getElementById('previewContainerAvatar').innerHTML = '';
    document.getElementById('avatar-file-name').textContent = 'File not selected';
    this.style.display = 'none';
  });
  


//LOGIN_FORM_VALIDATOR
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('#login-form');
  const generalError = document.querySelector('.non-field-errors');
  const emailErrorSpan = document.querySelector('#email_error');
  const passwordErrorSpan = document.querySelector('#password_error');

  if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const submitBtn = this.querySelector('.modal-submit');
          submitBtn.disabled = true;

          const formData = new FormData(this);
          const loginUrl = loginForm.dataset.url;
          const csrfToken = getCookie('csrftoken');

          console.log('CSRF Token:', csrfToken);

          fetch(loginUrl, {
              method: 'POST',
              body: formData,
              headers: {
                  'X-Requested-With': 'XMLHttpRequest',
                  'X-CSRFToken': csrfToken
              }
          })
          .then(response => {
              if (response.redirected) {
                  // Успешный редирект - просто перезагружаем страницу
                  window.location.reload();
                  return;
              }

              if (!response.ok) {
                  return response.json().then(errorData => {
                      if (errorData && errorData.errors) {
                          throw new Error(JSON.parse(errorData.errors)['__all__'][0].message);
                      } else {
                          return response.text().then(text => {
                              throw new Error('Network error with status ' + response.status + ': ' + text);
                          });
                      }
                  });
              }
              return response.json();
          })
          .then(data => {
              console.log('Ответ сервера (JSON):', data);
              submitBtn.disabled = false;

              if (data && data.errors) {
                  if (generalError) generalError.textContent = '';
                  if (emailErrorSpan) emailErrorSpan.textContent = '';
                  if (passwordErrorSpan) passwordErrorSpan.textContent = '';

                  const errors = JSON.parse(data.errors);
                  console.log('Ошибки формы:', errors);

                  if (errors.__all__) {
                      generalError.textContent = errors.__all__.join(', ');
                      generalError.style.display = 'block';
                  }
                  if (errors.email) {
                      emailErrorSpan.textContent = errors.email.join(', ');
                      emailErrorSpan.style.display = 'block';
                  }
                  if (errors.password) {
                      passwordErrorSpan.textContent = errors.password.join(', ');
                      passwordErrorSpan.style.display = 'block';
                  }
              }
          })
          .catch(error => {
              console.error('Ошибка AJAX:', error);
              submitBtn.disabled = false;
              generalError.textContent = error.message;
              generalError.style.display = 'block';
          });
      });
  } else {
      console.error('Форма логина не найдена.');
  }
});




//REGISTRATION
document.addEventListener('DOMContentLoaded', function () {
  const regForm = document.querySelector('[data-js-form]');
  if (!regForm) return;

  const submitBtn = regForm.querySelector('.modal-submit');
  const fieldErrors = {
      username: document.getElementById('name_error'),
      email: document.getElementById('email_error'),
      homepage: document.getElementById('homepage_error'),
      password1: document.getElementById('password_error'),
      password2: document.getElementById('confirm_password_error'),
      avatar: document.getElementById('avatar_error'),
  };

  regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      console.log('Отправка формы...');

      const formData = new FormData(regForm);
      const csrfToken = getCookie('csrftoken');

      // Очистка старых ошибок
      for (const key in fieldErrors) {
          if (fieldErrors[key]) {
              fieldErrors[key].textContent = '';
              fieldErrors[key].style.display = 'none';
          }
      }

      fetch(regForm.action, {
          method: 'POST',
          body: formData,
          headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRFToken': csrfToken,
          }
      })
      .then(response => {
          if (response.status === 200) {
              window.location.href = '/'; // Или обработка успешной регистрации
              return;
          }
          return response.json();
      })
      .then(data => {
          if (data && data.errors) {
              try {
                  const errors = JSON.parse(data.errors); // <----- Первый парс JSON
                  for (const key in errors) {
                      if (fieldErrors[key]) {
                          const messages = errors[key].map(error => error.message);
                          fieldErrors[key].textContent = messages.join(', ');
                          fieldErrors[key].style.display = 'block';
                      }
                  }
              } catch (e) {
                  console.error("Ошибка парсинга JSON ошибок:", e);
                  console.log("Полученные данные об ошибках:", data.errors);
              }
          } else if (data && data.message) {
              console.log('Сообщение:', data.message); // Обработка других сообщений с сервера
          }
      })
      .catch(error => {
          console.error('Registration error:', error);
      })
      .finally(() => {
          submitBtn.disabled = false;
      });
  });
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}







//модалка для ответа на коментарий!! Опцыонально
document.addEventListener('DOMContentLoaded', function () {
  const commentsContainer = document.getElementById('comments-container');

  if (commentsContainer) {
      commentsContainer.addEventListener('click', function (event) {
          if (event.target && event.target.classList.contains('reply-btn')) {
              const parentId = event.target.getAttribute('data-parent-id');
              const modal = document.getElementById('replyModal');
              modal.style.display = 'block';
              document.getElementById('replyParentId').value = parentId;
          }
      });
  }
});





// HTMX автоматически загрузит первую порцию ответов и кнопку "Load more"
document.addEventListener('DOMContentLoaded', () => {
  const originalButtonHTML = new Map(); // Сохраняем исходный HTML кнопок

  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('show-replies-btn')) {
      const commentId = event.target.dataset.commentId;
      const repliesContainer = document.getElementById(`replies-container-${commentId}`);
      const button = event.target;

      if (!originalButtonHTML.has(commentId)) {
        originalButtonHTML.set(commentId, button.innerHTML); // Сохраняем исходный HTML
      }

      if (repliesContainer.style.display === 'none') {
        repliesContainer.style.display = 'block';
        button.textContent = 'Hide replies';
        // HTMX автоматически загрузит первую порцию ответов

        repliesContainer.addEventListener('htmx:afterSwap', function afterSwapHandler(event) {
          const loadMoreContainer = repliesContainer.querySelector('.load-more-container');
          if (loadMoreContainer) {
            loadMoreContainer.addEventListener('htmx:beforeRequest', function(evt) {
              evt.target.remove(); // Удаляем кнопку "Load more" перед запросом
            });
          }
          repliesContainer.removeEventListener('htmx:afterSwap', afterSwapHandler); // Очищаем обработчик
        });
      } else {
        repliesContainer.style.display = 'none';
        button.innerHTML = originalButtonHTML.get(commentId); // Восстанавливаем исходный HTML
      }
    }
  });
});


// Сообщение "войти или зарегистрироваться" исчезает через 5 секунд
setTimeout(function() {
  const infoMessage = document.getElementById('modal-info-message');
  if (infoMessage) {
    infoMessage.style.opacity = '0';
    setTimeout(() => {
      infoMessage.style.display = 'none'; // Скрываем элемент после анимации
    }, 500);
  }
}, 5000);

// Сообщения об ошибках/успехе исчезают через 4 секунд
setTimeout(function() {
  const messageContainer = document.getElementById('message-container');
  if (messageContainer) {
    messageContainer.style.transition = 'opacity 0.5s ease-out';
    messageContainer.style.opacity = '0';
    setTimeout(() => {
      messageContainer.remove();  // Удаляем элемент из DOM
    }, 500);  // Подождём, пока анимация завершится
  }
}, 4000);