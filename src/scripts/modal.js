// ОТКРЫТИЕ И ЗАКРЫТИЕ ПОПАПОВ

function closePopup() {
    document.querySelector('.popup_is-opened').classList.toggle('popup_is-opened');
    document.removeEventListener('keydown', escToClose);
};

function openPopup(element) {
    element.classList.toggle('popup_is-opened');
    document.addEventListener('keydown', escToClose);
};

function escToClose(evt) {
    if (evt.key === 'Escape') {
        closePopup();
    };
};

export {openPopup, closePopup};