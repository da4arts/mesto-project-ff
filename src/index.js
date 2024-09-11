import { initialCards, createCard, removeCard, likeButtonToggle } from './scripts/cards.js'
import { openPopup, closePopup } from './scripts/modal.js';
import './pages/index.css'; 


// @todo: Темплейт карточки


// @todo: DOM узлы
const container = document.querySelector('.content');
const popupArray = document.querySelectorAll('.popup');
const editButton = container.querySelector('.profile__edit-button');
const popupEdit = document.querySelector('.popup_type_edit');
const addButton = container.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');

// массив постоянных интерактивных элементов
const clickable = [
    {selector: editButton, popupElement: popupEdit},
    {selector: addButton, popupElement: popupNewCard}
]; 


// Функция появления модульного окна
function imageClickCallback(evt) {
    if (evt.target.classList.contains('card__image')) {
        const popupImage = document.querySelector('.popup_type_image');
        popupImage.querySelector('.popup__image').src = evt.currentTarget.querySelector('.card__image').src;
        popupImage.querySelector('.popup__caption').textContent = evt.currentTarget.querySelector('.card__title').textContent;
        openPopup(popupImage);
    }
  }

// Стартовое заполнение стола
initialCards.forEach(function(item) {
    createCard(item, removeCard, likeButtonToggle, imageClickCallback);
});


// Слушатель клика на постоянных интерактивных элементах 
clickable.forEach((elmnt) =>{
    elmnt.selector.addEventListener('click', (evt) => {
        openPopup(elmnt.popupElement);
        if (elmnt.popupElement.classList.contains('popup_type_edit')) {
            const editForm = document.forms['edit-profile'];
            
            const nameInput = document.querySelector('.profile__title');
            const jobInput = document.querySelector('.profile__description');

            editForm.elements.name.value = nameInput.textContent;
            editForm.elements.description.value = jobInput.textContent;
        }
    });
});

// Слушатель закрывающего клика на попапах. 
popupArray.forEach((element) => {
    element.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('popup__close') || (evt.target === evt.currentTarget)) {
            closePopup();
        }
    });
})


// РАБОТЫ С ФОРМОЙ. 


// Обработка нажатия "СОХРАНИТЬ". для форм редактированиея, добавления

function handleFormSubmit(evt) {
    evt.preventDefault(); 
    switch(true) {
        case (evt.currentTarget.classList.contains('popup_type_edit')):
            const editForm = document.forms['edit-profile'];
            
            const nameInput = document.querySelector('.profile__title');
            const jobInput = document.querySelector('.profile__description');

            nameInput.textContent = editForm.elements.name.value;
            jobInput.textContent = editForm.elements.description.value;
            break;
        case (evt.currentTarget.classList.contains('popup_type_new-card')):
            const addForm = document.forms['new-place'];
            const cardNameInput = addForm.elements['place-name'].value;
            const cardLinkInput = addForm.elements['link'].value;
            const newCard = {
                name: cardNameInput,
                link: cardLinkInput
            };
            createCard(newCard, removeCard, likeButtonToggle, imageClickCallback);
            break;
        default:
            break;
    };        
    closePopup();
};

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»

popupArray.forEach((popupEl)=> {popupEl.addEventListener('submit', handleFormSubmit); });