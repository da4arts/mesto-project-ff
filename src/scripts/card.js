




// Создаем карточку.

function createCard(card, remove_callback, like_callback, imageClickCallback) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    cardElement.querySelector('.card__image').src = card.link;
    cardElement.querySelector('.card__image').alt = "пейзаж из " + card.name;
    cardElement.querySelector('.card__title').textContent = card.name;

    cardElement.querySelector('.card__delete-button').addEventListener('click', remove_callback);
    cardElement.addEventListener('click', like_callback);

    cardElement.addEventListener('click', imageClickCallback);

    return cardElement;
}


// Функция удаления карточки

function removeCard(event) {
  const eventTarget = event.target;
  eventTarget.closest('.card').remove();
};


//Обработчик нажатия на лайк
function likeButtonToggle(evt) {
  if (evt.target.classList.contains('card__like-button')) {
    evt.target.classList.toggle('card__like-button_is-active');
  }
}



export {createCard, removeCard, likeButtonToggle };
