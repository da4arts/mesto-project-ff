import {createCard, removeCard, likeButtonToggle} from './card.js';
// переменные API
const serverLinkProfile = 'https://nomoreparties.co/v1/wff-cohort-23/users/me';
const serverLinkCards = 'https://nomoreparties.co/v1/wff-cohort-23/cards';
const serverLinkLikes = 'https://nomoreparties.co/v1/wff-cohort-23/cards/likes/';
const serverLinkAvatar = 'https://nomoreparties.co/v1/wff-cohort-23/users/me/avatar';
const serverToken = 'f67b98a7-6c15-45e9-9b9f-f262fc587873';
let profileID;


const nameInput = document.querySelector('.profile__title'); //строка с именем
const jobInput = document.querySelector('.profile__description'); //строка с описанием
const avatarProfile = document.querySelector('.profile__image');
const cardContainer = document.querySelector('.places__list'); // здесь лежат карточки

// --------------
//      API
// --------------

// Загрузка профиля
export function downloadProfile () {
    return fetch(serverLinkProfile, {
        headers: {
            authorization: serverToken
        }
    })
    .then(res => res.json())
    .then((result) => {
        nameInput.textContent = result.name;
        jobInput.textContent = result.about;
        avatarProfile.style.backgroundImage = `url(${result.avatar})`;
        profileID = result["_id"];
    })
    .catch ((error) => {
        console.log(error);
    }) 
};

// скачиваем карточку
export function downloadCards(link, token, enhanceImageOnClick) {
    return fetch(link, {
        headers: {
            authorization: token
        }
    })
    .then(res => res.json())
    .then((result) => {
        result.forEach((newCard)=> {

            fetch(newCard.link)
            .then((res) => {
                if(res.ok) {return}
                else {
                    return Promise.reject(res.status);
                }
            })
            .then(() => {
                let isLike = false;
                isLike  = newCard.likes.some((item) => {
                    return item['_id'] === profileID
                    });


                

                cardContainer.append(
                    createCard(newCard,
                        removeCard, deleteImageFromServer,
                        likeButtonToggle, uploadLike, removeLike, isLike,
                        enhanceImageOnClick,
                        (newCard.owner["_id"] === profileID)
                    )
                );
            })
            .catch((error) =>{
                console.log(`error ${error}`);
            });

        });
    }) 
    .catch ((error) => {
        console.log(error);
    });
}

// загрузка на сервер нового профиля
export function loadProfile(link, token, newName, newDescription) {
    return fetch(link, {
            method: 'PATCH',
            headers: {
            authorization: token,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            name: newName,
            about: newDescription
            })
        });
};

// загрузка на сервер новой карточки
export function loadImage(link, token, imageName, imageLink) {
    return fetch(link, {
        method: 'POST',
        headers: {
            authorization: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: imageName,
            link: imageLink
        })
    })
    .then((res) => {
        if (res.ok) {
            console.log('image has been loaded');
        } else {
            return Promise.reject(res.status);
        }
    })
    .catch((err) => {
        console.log(err);
    });
};

// удаление изображения с сервера
export function deleteImageFromServer(cardID) {
    return fetch(serverLinkCards + '/'+ cardID, {
        method: 'DELETE',
        headers: {authorization: serverToken}
    })
    .catch ((error) => {
        console.log(error);
    });
};


// добавление лайка на сервер
export function uploadLike(card, counterClass) {
  
    return fetch(serverLinkLikes + '/'+ card.id, {
        method: 'PUT',
        headers: {authorization: serverToken}
    })
    .then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(res.status);
        }
    })
    .then((res) => {
        card.querySelector(counterClass).textContent = res.likes.length;
    })
    .catch((error) => {
        console.log('Error. CardID: '+ cardID);
        console.log(`error: ${error}`);
    });
};

// удаление лайка с сервера
export function removeLike(card, counterClass) {
    return fetch(serverLinkLikes + '/'+ card.id, {
        method: 'DELETE',
        headers: {authorization: serverToken}
    })
    .then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(res.status);
        }
    })
    .then((res) => {
        card.querySelector(counterClass).textContent = res.likes.length;
    })
    .catch((error) => {
        console.log('Error. CardID: '+ cardID);
        console.log(`error: ${error}`);
    });
};

// изменение аватара
export function uploadAvatar(avatarLink) {
    return fetch(serverLinkAvatar, {
        method: 'PATCH',
        headers: {
            authorization: serverToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            avatar: avatarLink
        })
    })
    .then((res) => {
        if (!res.ok) {
            return Promise.reject(res.status);
        }
    })
    .catch ((error) => {
        console.log(error);
    });
};