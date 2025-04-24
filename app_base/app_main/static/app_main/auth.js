document.addEventListener("DOMContentLoaded", () => {
  // Общая функция показа ошибок
  const displayError = (fieldId, errorMessage) => {
    const errorElement = document.getElementById(`${fieldId}_error`);
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.style.visibility = errorMessage ? "visible" : "hidden";
    }
  };

  // Проверка на пустое значение
  const isEmpty = (value) => !value || value.trim() === "";

  // Универсальная валидация файла с отдельной проверкой .txt
  const validateFile = (inputId, errorFieldId, maxSizeMB = 3) => {
    const input = document.getElementById(inputId);
    const file = input?.files[0];

    if (!file) {
      displayError(errorFieldId, "");
      return true;
    }

    const sizeKB = file.size / 1024;
    const extension = file.name.split('.').pop().toLowerCase();

    // Если это .txt, то проверяем на 100KB
    if (extension === "txt") {
      if (sizeKB > 100) {
        displayError(errorFieldId, `TXT-файл слишком большой (${Math.round(sizeKB)}KB). Максимум 100KB.`);
        return false;
      }
    } else {
      // Для остальных — проверка на размер в MB
      if (sizeKB > maxSizeMB * 1024) {
        displayError(errorFieldId, `Файл слишком большой (${(sizeKB / 1024).toFixed(2)}MB). Максимум: ${maxSizeMB}MB.`);
        return false;
      }
    }

    displayError(errorFieldId, "");
    return true;
  };

  // Функция очистки и отображения выбранного файла
  const setupFileInput = (inputId, nameId, removeBtnId, errorFieldId) => {
    const input = document.getElementById(inputId);
    const name = document.getElementById(nameId);
    const removeBtn = document.getElementById(removeBtnId);

    input.addEventListener("change", () => {
      if (input.files.length > 0) {
        name.textContent = input.files[0].name;
        removeBtn.style.display = "inline";
      } else {
        name.textContent = "File not selected";
        removeBtn.style.display = "none";
      }
      validateFile(inputId, errorFieldId);
    });

    removeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      input.value = "";
      name.textContent = "File not selected";
      removeBtn.style.display = "none";
      displayError(errorFieldId, "");
    });
  };

  // Универсальная установка валидации файла при отправке формы
  const setupFileFormValidation = (formId, inputId, errorFieldId) => {
    const form = document.getElementById(formId);
    form.addEventListener("submit", (e) => {
      if (!validateFile(inputId, errorFieldId)) {
        e.preventDefault();
      }
    });
  };

  // ------------------ Валидация формы регистрации ------------------ //
  const validateName = () => {
    const name = document.getElementById("name").value.trim();
    if (isEmpty(name)) {
      displayError("name", "Name is required.");
      return false;
    }
    if (name.length < 2) {
      displayError("name", "The name must be at least 2 characters.");
      return false;
    }
    displayError("name", "");
    return true;
  };

  const validateEmail = () => {
    const email = document.getElementById("email").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isEmpty(email)) {
      displayError("email", "Email is required.");
      return false;
    }
    if (!emailPattern.test(email)) {
      displayError("email", "Please enter a valid email.");
      return false;
    }
    displayError("email", "");
    return true;
  };

  const validatePassword = () => {
    const password = document.getElementById("password").value;
    if (isEmpty(password)) {
      displayError("password", "Password is required.");
      return false;
    }
    if (password.length < 4) {
      displayError("password", "Password must be at least 4 characters.");
      return false;
    }
    displayError("password", "");
    return true;
  };

  const validateConfirmPassword = () => {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    if (isEmpty(confirmPassword)) {
      displayError("confirm_password", "Please confirm your password.");
      return false;
    }
    if (password !== confirmPassword) {
      displayError("confirm_password", "Passwords do not match.");
      return false;
    }
    displayError("confirm_password", "");
    return true;
  };

  const isFormValid = () => {
    return (
      validateName() &&
      validateEmail() &&
      validatePassword() &&
      validateConfirmPassword() &&
      validateFile("avatarInput", "avatar")
    );
  };

  const registerForm = document.querySelector("form[data-js-form]");
  const submitBtn = document.getElementById("submit_button");

  if (registerForm) {
    registerForm.addEventListener("input", () => {
      submitBtn.disabled = !isFormValid();
    });

    registerForm.addEventListener("submit", (e) => {
      if (!isFormValid()) e.preventDefault();
    });

    document.getElementById("name").addEventListener("blur", validateName);
    document.getElementById("email").addEventListener("blur", validateEmail);
    document.getElementById("password").addEventListener("blur", validatePassword);
    document.getElementById("confirm_password").addEventListener("blur", validateConfirmPassword);

    setupFileInput("avatarInput", "avatar-file-name", "remove-avatar-file", "avatar");
  }

  // ------------------ Комментарии ------------------ //
  setupFileInput("fileInput", "file-name", "remove-file", "comment_file");
  setupFileFormValidation("commentForm", "fileInput", "comment_file");

  // ------------------ Ответ на комментарий ------------------ //
  setupFileInput("replyFileInput", "reply-file-name", "remove-reply-file", "reply_file");
  setupFileFormValidation("replyForm", "replyFileInput", "reply_file");
});


