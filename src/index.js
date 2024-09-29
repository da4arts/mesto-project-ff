import { createCard, removeCard, likeButtonToggle } from './scripts/card.js'
import { openPopup, closePopup, enableValidation } from './scripts/modal.js';
import './pages/index.css'; 
import * as api from './scripts/api.js';

//-------------------
//     КОНСТАНТЫ
//-------------------
const container = document.querySelector('.content');
const cardContainer = container.querySelector('.places__list'); // здесь лежат карточки
const popupArray = document.querySelectorAll('.popup'); // массив всех попапов

// редактирование профиля
const editButton = container.querySelector('.profile__edit-button'); // кнопка
const nameInput = document.querySelector('.profile__title'); //строка с именем
const jobInput = document.querySelector('.profile__description'); //строка с описанием
const avatarProfile = document.querySelector('.profile__image');
const buttonAvatarEdit = document.querySelector('.profile__image-hover');
const popupAvatar = document.querySelector('.popup_type_new-avatar');
const formAvatar = document.forms['new-avatar'];
const popupEdit = document.querySelector('.popup_type_edit'); //попап
const editForm = document.forms['edit-profile']; //форма


// добавление новой карточки
const buttonNewCard = container.querySelector('.profile__add-button'); //кнопка
const popupNewCard = document.querySelector('.popup_type_new-card'); //попап
const formNewCard = document.forms['new-place']; //форма

// интерактивность карточек
const popupImage = document.querySelector('.popup_type_image'); //попап
const picturePopupImage = popupImage.querySelector('.popup__image');   
const captionPopupImage = popupImage.querySelector('.popup__caption');  

// массив постоянных интерактивных элементов
const clickable = [
    {selector: editButton, popupElement: popupEdit},
    {selector: buttonNewCard, popupElement: popupNewCard},
    {selector: buttonAvatarEdit, popupElement: popupAvatar}
]; 

//массив обработчиков кнокип "Сохранить"
const handlersSubmit = [];

// конфигурация валидации
const configValidation = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  };

// переменные API
const serverLinkProfile = 'https://nomoreparties.co/v1/wff-cohort-23/users/me';
const serverLinkCards = 'https://nomoreparties.co/v1/wff-cohort-23/cards';
const serverLinkLikes = 'https://nomoreparties.co/v1/wff-cohort-23/cards/likes/';
const serverLinkAvatar = 'https://nomoreparties.co/v1/wff-cohort-23/avatar';
const serverToken = 'f67b98a7-6c15-45e9-9b9f-f262fc587873';

//-------------------
//     ФУНКЦИИ
//-------------------


// Функция увеличения изображения при нажатии
function enhanceImageOnClick(evt) {
    if (evt.target.classList.contains('card__image')) {
        picturePopupImage.src = evt.currentTarget.querySelector('.card__image').src;
        picturePopupImage.alt = evt.currentTarget.querySelector('.card__image').alt;
        captionPopupImage.textContent = evt.currentTarget.querySelector('.card__title').textContent;
        openPopup(popupImage);
    }
  }

function renderSaving(form) {
    const button = form.querySelector('.button__submit');
    button.classList.toggle('saving');


    if (button.classList.contains('saving')) {
        button.textContent = 'Сохранение...';
        button.classList.add('popup__button_disabled');
    }
    else {
        button.textContent = 'Cохранить';
        button.classList.remove('popup__button_disabled');
    }
}


// Обработка нажатия "СОХРАНИТЬ".
// для добавления новой карточки

handlersSubmit.push({
    element: popupNewCard,
    handler: function handleNewCardFormSubmit(evt) {   
        evt.preventDefault(); 
        renderSaving(formNewCard);   
        const cardNameInput = formNewCard.elements['place-name'].value;
        const cardLinkInput = formNewCard.elements['link'].value;
        const newCard = {
            name: cardNameInput,
            link: cardLinkInput,
            likes: 0
        };

        cardContainer.prepend(createCard(newCard,
            removeCard, api.deleteImageFromServer,
            likeButtonToggle, api.uploadLike, api.removeLike, false,
            enhanceImageOnClick,
            true
        ));
        api.loadImage(serverLinkCards, serverToken, newCard.name, newCard.link)
        .then(()=> {
            renderSaving(formNewCard); 
            closePopup(popupNewCard);
        })
    }
});

// для формы редактирования профиля

handlersSubmit.push({
    element: popupEdit,
    handler: function handleEditFormSubmit(evt) {
        evt.preventDefault(); 
        renderSaving(editForm);
        
        
        
        api.loadProfile(serverLinkProfile, serverToken, nameInput.textContent, jobInput.textContent)
        .then(() => {
            nameInput.textContent = editForm.elements.name.value;
            jobInput.textContent = editForm.elements.description.value;
            closePopup(popupEdit);
            renderSaving(editForm);
        })
        .catch((err) => {
            console.log(err);
        });

    }
});

// для обновления аватарки
handlersSubmit.push({
    element: popupAvatar,
    handler: function handleAvatarFormSubmit(evt) {
        evt.preventDefault(); 
        renderSaving(formAvatar);
        const cardLinkInput = formAvatar.elements['avatar-link'].value;

        function loadImage() {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.addEventListener('load', resolve);
                image.addEventListener('error', reject);
                image.src = cardLinkInput;
            });
        };

        loadImage()
        .then(api.uploadAvatar(cardLinkInput))
        .then(() => {
            avatarProfile.style.backgroundImage = `url(${cardLinkInput})`;
            renderSaving(formAvatar);
            closePopup(popupAvatar);
        })
        .catch((err) => {
            console.log(err);
        });

       
    }
});


// Удаление карточки



// ----------------------
//      СЛУШАТЕЛИ
//-----------------------

// Слушатель клика на постоянных интерактивных элементах 

clickable.forEach((elmnt) =>{
    elmnt.selector.addEventListener('click', (evt) => {
        
        if (elmnt.popupElement.classList.contains('popup_type_edit')) {
                        
            const nameInput = document.querySelector('.profile__title');
            const jobInput = document.querySelector('.profile__description');

            editForm.elements.name.value = nameInput.textContent;
            editForm.elements.description.value = jobInput.textContent;
        };
        openPopup(elmnt.popupElement);
    });
});

// Слушатель закрывающего клика на всех попапах. 

popupArray.forEach((element) => {
    element.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('popup__close') || (evt.target === evt.currentTarget)) {
            closePopup(evt.currentTarget);
        };
    });
});




// ---------------------------
//    ЗАГРУЗКА СТРАНИЦЫ
// ---------------------------

// каждой форме с кнопкой сохранить насраиваем соответсвующий слушатель.

handlersSubmit.forEach((item)=>{item.element.addEventListener('submit', item.handler)});
enableValidation(configValidation);

// Загрузка данных с сервера
api.downloadProfile(serverLinkProfile, serverToken)
.then(api.downloadCards(serverLinkCards, serverToken, enhanceImageOnClick))
.then (()=> {
    console.log('Startup download from server has been finished.');
})
.catch((error) => {
    console.error(error);
});

