import { initialCards } from './scripts/cards.js'
import { createCard, removeCard, likeButtonToggle } from './scripts/card.js'
import { openPopup, closePopup } from './scripts/modal.js';
import './pages/index.css'; 


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
const popupEdit = document.querySelector('.popup_type_edit'); //попап
const editForm = document.forms['edit-profile']; //форма

// добавление новой карточки
const buttonNewCard = container.querySelector('.profile__add-button'); //кнопка
const popupNewCard = document.querySelector('.popup_type_new-card'); //попап
const formNewCard = document.forms['new-place']; //форма

// интерактивность карточек
const popupImage = document.querySelector('.popup_type_image'); //попап

// массив постоянных интерактивных элементов
const clickable = [
    {selector: editButton, popupElement: popupEdit},
    {selector: buttonNewCard, popupElement: popupNewCard}
]; 

//массив обработчиков кнокип "Сохранить"
const handlersSubmit = [];

//-------------------
//     ФУНКЦИИ
//-------------------

// Функция увеличения изображения при нажатии
function enhanceImageOnClick(evt) {
    if (evt.target.classList.contains('card__image')) {
        popupImage.querySelector('.popup__image').src = evt.currentTarget.querySelector('.card__image').src;
        popupImage.querySelector('.popup__caption').textContent = evt.currentTarget.querySelector('.card__title').textContent;
        openPopup(popupImage);
    }
  }

// Обработка нажатия "СОХРАНИТЬ".
// для формы редактирования

handlersSubmit.push({
    element: popupNewCard,
    handler: function handleNewCardFormSubmit(evt) {   
        evt.preventDefault();         
        const cardNameInput = formNewCard.elements['place-name'].value;
        const cardLinkInput = formNewCard.elements['link'].value;
        const newCard = {
            name: cardNameInput,
            link: cardLinkInput
        };
        cardContainer.prepend(createCard(newCard, removeCard, likeButtonToggle, enhanceImageOnClick));
        closePopup(popupNewCard);
    }
});

// для формы добавления новой карточки

handlersSubmit.push({
    element: popupEdit,
    handler: function handleEditFormSubmit(evt) {
        evt.preventDefault(); 
        nameInput.textContent = editForm.elements.name.value;
        jobInput.textContent = editForm.elements.description.value;
        closePopup(popupEdit);
    }
});

// ----------------------
//      СЛУШАТЕЛИ
//-----------------------

// Слушатель клика на постоянных интерактивных элементах 

clickable.forEach((elmnt) =>{
    elmnt.selector.addEventListener('click', (evt) => {
        
        if (elmnt.popupElement.classList.contains('popup_type_edit')) {
            const editForm = document.forms['edit-profile'];
            
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

// Стартовое заполнение стола

initialCards.forEach(function(item) {
    cardContainer.append(createCard(item, removeCard, likeButtonToggle, enhanceImageOnClick));
});