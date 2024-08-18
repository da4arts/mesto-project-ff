// @todo: Темплейт карточки


// @todo: DOM узлы
const container = document.querySelector('.content');
const cardContainer = container.querySelector('.places__list');
const addButton = container.querySelector('.profile__add-button');

// @todo: Функция создания карточки
function createCard(cardName, cardUrl) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    cardElement.querySelector('.card__image').src = cardUrl;
    cardElement.querySelector('.card__image').textContent = cardName;
    
    cardElement.querySelector('.card__delete-button').addEventListener('click', removeCard);
    
    cardContainer.append(cardElement);
}
// @todo: Функция удаления карточки

function removeCard(event) {
    const eventTarget = event.target;
    eventTarget.parentElement.remove();
};

// @todo: Вывести карточки на страницу

initialCards.forEach(function(item) {
    createCard(item.name, item.link);
});

