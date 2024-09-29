import { enableValidation, clearValidation } from "./validation.js";

//-------------------------------
// ОТКРЫТИЕ И ЗАКРЫТИЕ ПОПАПОВ
//-------------------------------
function closePopup(element) {
    element.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', escToClose);
    clearValidation(element);
};

function openPopup(element) {
    element.classList.add('popup_is-opened');
    document.addEventListener('keydown', escToClose);
};

function escToClose(evt) {
    if (evt.key === 'Escape') {
        closePopup(document.querySelector('.popup_is-opened'));
    };
};
  
export {openPopup, closePopup, enableValidation};