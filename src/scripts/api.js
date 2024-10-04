// переменные API
const serverLink = 'https://nomoreparties.co/v1/wff-cohort-23'
const serverLinkProfile = serverLink + '/users/me';
const serverLinkAvatar = serverLinkProfile + '/avatar';
const serverLinkCards = serverLink + '/cards';
const serverLinkLikes = serverLinkCards + '/likes';
const serverToken = 'f67b98a7-6c15-45e9-9b9f-f262fc587873';


function handleResponse(res) {
    if (res.ok) {
        return Promise.resolve(res.json());
    } else {
        return Promise.reject(res.status);
    };
};

// --------------
//      API
// --------------

//-------------------
// CARDS
//загрузка карточек
export function downloadCards() {
    return fetch(serverLinkCards, {
        headers: {
            authorization: serverToken
        }
    })
    .then((res) => {
        return handleResponse(res);
    });
};

// загрузка на сервер новой карточки
export function generateCard(imageName, imageLink) {
    return fetch(serverLinkCards, {
        method: 'POST',
        headers: {
            authorization: serverToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: imageName,
            link: imageLink
        })
    })
    .then((res) => {
        return handleResponse(res);
    });
};

// удаление карточки с сервера
export function deleteImageFromServer(cardElement) {
    return fetch(serverLinkCards + '/'+ cardElement.id, {
        method: 'DELETE',
        headers: {authorization: serverToken}
    })
    .then((res) => {
        return handleResponse(res);
    });
};

//-------------------
// PROFILE
// Загрузка профиля с сервера
export function downloadProfile () {
        return fetch(serverLinkProfile, {
            headers: {
                authorization: serverToken
            }
        })
        .then((res) => {
            return handleResponse(res);
        });
};

// загрузка на сервер нового профиля
export function updateProfile(newName, newDescription) {
    return fetch(serverLinkProfile, {
            method: 'PATCH',
            headers: {
                authorization: serverToken,
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({
                name: newName,
                about: newDescription
                })
    })
    .then((res) => {
        return handleResponse(res);
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
        return handleResponse(res);
    });
};
//-------------------
// LIKES
// добавление лайка на сервер
export function uploadLike(cardElement) {
  
    return fetch(serverLinkLikes + '/'+ cardElement.id, {
        method: 'PUT',
        headers: {authorization: serverToken}
    })
    .then((res) => {
        return handleResponse(res);
    });
};

// удаление лайка с сервера
export function removeLike(cardElement) {
    return fetch(serverLinkLikes + '/'+ cardElement.id, {
        method: 'DELETE',
        headers: {authorization: serverToken}
    })
    .then((res) => {
        return handleResponse(res);
    });
};


