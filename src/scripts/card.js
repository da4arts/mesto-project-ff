// Создаем карточку.

function createCard(card, remove_callback,  deleteFromServer, like_callback, uploadLike, removeLike, isLike,
  imageClickCallback, optionDeleteButton) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    
    cardElement.id = card["_id"];
    cardImage.src = card.link;
    cardImage.alt = "пейзаж из " + card.name;
    cardElement.querySelector('.card__title').textContent = card.name;
    cardElement.querySelector('.card__likes-counter').textContent = card.likes.length;    
    
    if (isLike) {
      cardElement.querySelector('.card__like-button').classList.add('card__like-button_is-active');
    }

    if (optionDeleteButton) {
      cardElement.querySelector('.card__delete-button').style.visibility = "visible";
    };

    cardElement.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('card__like-button')) {
        if (evt.target.classList.contains('card__like-button_is-active')) {
          removeLike(evt.currentTarget, '.card__likes-counter');
        } else {
          uploadLike(evt.currentTarget,'.card__likes-counter' );
        };
        like_callback(evt);
      } else if (evt.target.classList.contains('card__delete-button')) {
        deleteFromServer(evt.currentTarget.id);
        remove_callback(evt);
      } else if (evt.target.classList.contains('card__image')) {
        imageClickCallback(evt);
      };
    });

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
