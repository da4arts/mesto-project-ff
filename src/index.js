import {createCard, toggleLike, removeCard} from './scripts/card.js'
import {showPopup, hidePopup} from './scripts/modal.js';
import './pages/index.css'; 
import * as api from './scripts/api.js';
import {clearValidation, enableValidation } from './scripts/validation.js';
let profileID;

//-------------------
//     КОНСТАНТЫ
//-------------------
const container = document.querySelector('.content');
const cardContainer = container.querySelector('.places__list'); // здесь лежат карточки
const popupArray = document.querySelectorAll('.popup'); // массив всех попапов

// редактирование профиля
const buttonEdit = container.querySelector('.profile__edit-button'); // кнопка
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
    {button: buttonEdit, popupElement: popupEdit},
    {button: buttonNewCard, popupElement: popupNewCard},
    {button: buttonAvatarEdit, popupElement: popupAvatar}
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

//-------------------
//     ФУНКЦИИ
//-------------------

//проверка возможности загрузить изображение по ссылке
function checkImageLink(link) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', resolve);
        image.addEventListener('error', reject);
        image.src = link;
    });
};

// Добавление очистики вылидации при закрытия попапа.
function closePopup(element) {
    hidePopup(element);   
    clearValidation(element.querySelector('.popup__form'));
}

//------------------------------
// КАРТОЧКИ
//создание локальной карточки при старте
function createLocalCardOnStart(newCard)  {
        return checkImageLink(newCard.link)
        .then(() => {
            return new Promise((resolve, reject) => {
                
                if ((newCard.owner["_id"]).length > 0) {
                    cardContainer.append(
                        createCard(newCard,
                            deleteCard,
                            toggleCardButtonLike, 
                            enhanceImageOnClick,
                            profileID)
                    );
                    resolve('Card has been created');
                } else {
                    reject('no ID');
                };
            });
        })
};

//создание локальной карточки при заполнение формы
function generateLocalCard(result) {
    if ((result.owner["_id"]).length > 0) {
        cardContainer.prepend(
            createCard(result,
                deleteCard,
                toggleCardButtonLike,
                enhanceImageOnClick,
                profileID
            )
        );
    };
}

//удаление карточки из БД,а затем локальное
function deleteCard(cardElement) {
    api.deleteImageFromServer(cardElement)
    .then((res) => {
        removeCard(res);
    })
    .catch((error)=>{
        console.log(error);
    });
}

// Функция увеличения изображения при нажатии
function enhanceImageOnClick(evt) {
    if (evt.target.classList.contains('card__image')) {
        picturePopupImage.src = evt.currentTarget.querySelector('.card__image').src;
        picturePopupImage.alt = evt.currentTarget.querySelector('.card__image').alt;
        captionPopupImage.textContent = evt.currentTarget.querySelector('.card__title').textContent;
        showPopup(popupImage);
    }
}

//--------------------------------------
// ПРОФИЛЬ
//обновление профиля из серверных данных
function syncLocalProfile(result) {
    nameInput.textContent = result.name;
    jobInput.textContent = result.about;
    avatarProfile.style.backgroundImage = `url(${result.avatar})`;
    profileID = result["_id"];
};

// ---------------------------------
// ЛАЙКИНГ
// перекрашивание сердца и запуск пересчета лайков 
function toggleCardButtonLike(cardElement) {
    const buttonLike = cardElement.querySelector('.card__like-button');
    if (buttonLike.classList.contains('card__like-button_is-active')) {
        api.removeLike(cardElement)
        .then((res) => {
            updateLikesCounter(cardElement, res);
            toggleLike(buttonLike);
        })
        .catch((error) => {
            console.log(error);
        });
    } else {
        api.uploadLike(cardElement)
        .then((res) => {
            updateLikesCounter(cardElement, res);
            toggleLike(buttonLike);
        })
        .catch((error) => {
            console.log(error);
        });
    };
    
};

// обновление счетчика лайков
function updateLikesCounter(cardElement, card) {
    const counterElement = cardElement.querySelector('.card__likes-counter')
    counterElement.textContent = card.likes.length;
}

// ------------------------------------
// Обработка нажатия "СОХРАНИТЬ".
// для добавления новой карточки

handlersSubmit.push({
    element: popupNewCard,
    handler: function handleNewCardFormSubmit(evt) {   
        evt.preventDefault(); 
        renderSaving(formNewCard);   
        const cardNameInput = formNewCard.elements['place-name'].value;
        const cardLinkInput = formNewCard.elements['link'].value;

        api.generateCard(cardNameInput, cardLinkInput)
        .then((res) => {
            generateLocalCard(res);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
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
        const name = editForm.elements['name'].value;
        const description = editForm.elements['description'].value;

        api.updateProfile(name, description)
        .then((profile) => {
            syncLocalProfile(profile);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(()=> {
            closePopup(popupEdit);
            renderSaving(editForm);
        });

    }
});

// для обновления аватарки
handlersSubmit.push({
    element: popupAvatar,
    handler: function handleAvatarFormSubmit(evt) {
        evt.preventDefault(); 
        renderSaving(formAvatar);
        const linkAvatar = formAvatar.elements['avatar-link'].value;

        checkImageLink(linkAvatar)
        .then(() => {
            return api.uploadAvatar(linkAvatar)
        })
        .then((res) => {
            syncLocalProfile(res);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(()=> {
            closePopup(popupAvatar);
            renderSaving(formAvatar);
        });

       
    }
});

// переключение визуализации процесса сохранения
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

// ----------------------
//      СЛУШАТЕЛИ
//-----------------------

// Слушатель клика на постоянных интерактивных элементах 

clickable.forEach((elmnt) =>{
    elmnt.button.addEventListener('click', (evt) => {
        
        if (elmnt.popupElement.classList.contains('popup_type_edit')) {
                        
            const nameInput = document.querySelector('.profile__title');
            const jobInput = document.querySelector('.profile__description');

            editForm.elements.name.value = nameInput.textContent;
            editForm.elements.description.value = jobInput.textContent;
        };
        showPopup(elmnt.popupElement);
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
Promise.all([api.downloadProfile(), api.downloadCards()])
.then(([profileData, cardsData]) => {
    syncLocalProfile(profileData);
    return Promise.all(cardsData.map((card) => {
        return createLocalCardOnStart(card);
        })
    );
})
.catch((error) => {
    console.log(error);
});

