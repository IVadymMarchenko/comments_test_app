// Функция для переключения видимости ответов
function toggleReplies(btn) {
    const replies = btn.parentElement.nextElementSibling;
    
    // Проверка текущего состояния отображения
    if (replies.style.display === 'none') {
      replies.style.display = 'block';
      btn.textContent = 'Hide answers';
    } else {
      replies.style.display = 'none';
      btn.textContent = 'Show answers';
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
  