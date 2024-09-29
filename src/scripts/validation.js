let configValidation;
//------------------------
// ВАЛИДАЦИЯ ФОРМ ПОПАПОВ
//------------------------
// Функция, которая добавляет класс с ошибкой
const showInputError = (formElement, inputElement, errorMessage) => {
    // Находим элемент ошибки внутри самой функции
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    // Остальной код такой же
    inputElement.classList.add(configValidation.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(configValidation.errorClass);
};
  
// Функция, которая удаляет класс с ошибкой
const hideInputError = (formElement, inputElement) => {
    // Находим элемент ошибки
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    // Остальной код такой же
    inputElement.classList.remove(configValidation.inputErrorClass);
    errorElement.classList.remove(configValidation.errorClass);
    errorElement.textContent = '';
};

// Функция валидации
const isValid = (formElement, inputElement) => {
    if (!inputElement.validity.valid) {
        // Если поле не проходит валидацию, покажем ошибку
        showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
        // Если проходит, скроем
        hideInputError(formElement, inputElement);
    }
};

//Функция деактивации кнопки "сохранить"
const hasInvalidInput = (inputList) => {
    // проходим по этому массиву методом some
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    })
};

const toggleButtonState = (inputList, buttonElement) => {
    // Если есть хотя бы один невалидный инпут
    if (hasInvalidInput(inputList)) {
        // сделай кнопку неактивной
        buttonElement.disabled = true;
        buttonElement.classList.add(configValidation.inactiveButtonClass);
    } else {
        // иначе сделай кнопку активной
        buttonElement.disabled = false;
        buttonElement.classList.remove(configValidation.inactiveButtonClass);
    }
}; 

//Функция перебора полей формы
const setEventListeners = (formElement) => {
    // Находим все поля внутри формы,
    // сделаем из них массив методом Array.from
    const inputList = Array.from(formElement.querySelectorAll(configValidation.inputSelector));
    toggleButtonState(inputList, formElement.querySelector(configValidation.submitButtonSelector));

    // Обойдём все элементы полученной коллекции
    inputList.forEach((inputElement) => {
      // каждому полю добавим обработчик события input
      inputElement.addEventListener('input', () => {
        // Внутри колбэка вызовем isValid,
        // передав ей форму и проверяемый элемент
        isValid(formElement, inputElement)
        toggleButtonState(inputList, formElement.querySelector(configValidation.submitButtonSelector));
      });
    });
  };


// Фунция активации валидации
const enableValidation = (config) => {
    // Найдём все формы с указанным классом в DOM,
    // сделаем из них массив методом Array.from
    configValidation = config;
    const formList = Array.from(document.querySelectorAll(configValidation.formSelector));

    // Переберём полученную коллекцию
    formList.forEach((formElement) => {
        // Для каждой формы вызовем функцию setEventListeners,
        // передав ей элемент формы
        setEventListeners(formElement);
    });
};

const clearValidation = function (element) {
    const formElement = element.querySelector(configValidation.formSelector);
    if (formElement === null) {return};
    const arrayErrorInputs = Array.from(formElement.querySelectorAll(configValidation.errorClass));
    const buttonElement = formElement.querySelector(configValidation.submitButtonSelector);
    const arrayInputs = Array.from(formElement.querySelectorAll(configValidation.inputSelector));

    // убираем класс активации ошибки
    arrayErrorInputs.forEach((errorElement) => {
        hideInputError(formElement, errorElement);
    });

    // зачистка полей формы
    arrayInputs.forEach((inputElement) => {
        formElement.elements[inputElement.getAttribute('name')].value = '';
    });

    buttonElement.classList.remove(configValidation.inputErrorClass.inactiveButtonClass);
};

export{enableValidation, clearValidation}