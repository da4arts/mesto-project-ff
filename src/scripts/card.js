// Создаем карточку.

function createCard(card, deleteCard, toggleCardButtonLike, 
  callbackCardImage, profileID) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    
    cardElement.id = card["_id"];
    cardImage.src = card.link;
    cardImage.alt = "пейзаж из " + card.name;
    cardElement.querySelector('.card__title').textContent = card.name;
    cardElement.querySelector('.card__likes-counter').textContent = card.likes.length;    
    
    // проверка, создана ли карточка текущим пользователем.
    // в позитивном случае, проверяем лайкал ли пользователь карточку раньше.
    const propertyOwn = (card.owner["_id"] === profileID);
    if (propertyOwn) {
      cardElement.querySelector('.card__delete-button').style.visibility = "visible";
      const isLike = card.likes.some((item) => {
        return (item['_id'] === profileID);
      });
      
      if (isLike) {
        cardElement.querySelector('.card__like-button').classList.add('card__like-button_is-active');
      }
    
    };

    cardElement.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('card__like-button')) {
        toggleCardButtonLike(evt.currentTarget);
      } else if (evt.target.classList.contains('card__delete-button') && propertyOwn) {
        deleteCard(evt.currentTarget);
      } else if (evt.target.classList.contains('card__image')) {
        callbackCardImage(evt);
      };
    });

    return cardElement;
}


// Функция удаления карточки

function removeCard(cardElement) {
  cardElement.remove();
};


//Обработчик нажатия на лайк
function toggleLike(button) {
  if (button.classList.contains('card__like-button')) {
    button.classList.toggle('card__like-button_is-active');
  }
}



export {createCard, removeCard, toggleLike };
