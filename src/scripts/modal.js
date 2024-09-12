// ОТКРЫТИЕ И ЗАКРЫТИЕ ПОПАПОВ

function closePopup(element) {
    element.classList.toggle('popup_is-opened');
    document.removeEventListener('keydown', escToClose);
};

function openPopup(element) {
    element.classList.toggle('popup_is-opened');
    document.addEventListener('keydown', escToClose);
};

function escToClose(evt) {
    if (evt.key === 'Escape') {
        closePopup(document.querySelector('.popup_is-opened'));
    };
};

export {openPopup, closePopup};