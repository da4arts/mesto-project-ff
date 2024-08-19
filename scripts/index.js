// @todo: Темплейт карточки


// @todo: DOM узлы
const container = document.querySelector('.content');
const cardContainer = container.querySelector('.places__list');
const addButton = container.querySelector('.profile__add-button');

// @todo: Функция создания карточки
function createCard(card, callback) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    cardElement.querySelector('.card__image').src = card.link;
    cardElement.querySelector('.card__image').alt = "пейзаж из " + card.name;
    cardElement.querySelector('.card__image').textContent = card.name;
    
    cardElement.querySelector('.card__delete-button').addEventListener('click', callback);
    
    cardContainer.append(cardElement);
}
// @todo: Функция удаления карточки

function removeCard(event) {
    const eventTarget = event.target;
    eventTarget.closest('.card').remove();
};

// @todo: Вывести карточки на страницу

initialCards.forEach(function(item) {
    createCard(item, removeCard);
});

