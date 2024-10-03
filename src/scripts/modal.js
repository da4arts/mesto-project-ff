//-------------------------------
// ОТКРЫТИЕ И ЗАКРЫТИЕ ПОПАПОВ
//-------------------------------
function hidePopup(element) {
    element.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeOnEsc);
};

function showPopup(element) {
    element.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeOnEsc);
};

//  callback закрытия при нажатии на esc
function closeOnEsc(evt) {
    if (evt.key === 'Escape') {
        hidePopup(document.querySelector('.popup_is-opened'));
    };
};
  
export {hidePopup, showPopup};