const formOne = document.getElementById('form-1');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

formOne.addEventListener('submit', formSubmitted);

function formSubmitted(e) {
    e.preventDefault();

    let username = usernameInput.value;
    let email = emailInput.value;
    let password = passwordInput.value;

    postData(username, email, password)
}

function postData(username, email, password) {
    const obj = { username: username, email: email, password: password};
    console.log(obj)

    fetch('http://127.0.0.1:4000/signup', {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.error) {
            console.log(data.message);
        }
        else {
            storeInLocalStorage('email', data.email)
            storeInLocalStorage('id', data._id)
        }
    })
    .catch(err => console.log('error posting data', err))
}

// ------------------------------------------ EDIT MESSAGE ---------------------------------------
const formTwo = document.getElementById('form-2');
const messageInput = document.getElementById('message');

formTwo.addEventListener('submit', editEntry);

function editEntry(e) {
    e.preventDefault();
  
    const userId = retrieveFromLocalStorage('id');
    const message = messageInput.value;

    const obj = { _id: userId, message }
    console.log('user', userId, 'message', message)

    fetch('http://127.0.0.1:4000/update', {
        method: "PUT",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log('error posting data', err))
    
}

// ------------------------------------- LOGIN --------------------------------------
const formLogin = document.getElementById('form-3');
const emailLogin = document.getElementById('email-login');
const passwordLogin = document.getElementById('password-login');

formLogin.addEventListener('submit', loginSubmit);

function loginSubmit(e) {
    e.preventDefault();
    
    const email = emailLogin.value;
    const password = passwordLogin.value;
    const obj = { email: email, password: password };

    fetch('http://127.0.0.1:4000/login', {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.error) {
            console.log(data.message)
        }
        else {
            storeInLocalStorage('email', data.email)
            storeInLocalStorage('id', data._id)
        }
        
    })
    .catch(err => console.log('error posting data', err, err.message))
}

// --------------------------------------------- DELETE USER ------------------------------------
const deleteBtn = document.getElementById('delete-btn');

deleteBtn.addEventListener('click', deleteUser);

function deleteUser() {
    const userId = retrieveFromLocalStorage("id");
    const obj = { id: userId }
    console.log(userId)

    fetch('http://127.0.0.1:4000/delete', {
        method: "DELETE",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        removeFromLocalStorage("id")
        removeFromLocalStorage("email")
    })
    .catch(err => console.log('error deleting data', err))
}

// ----------------------------------------- LOCAL STORAGE ---------------------------------------
function storeInLocalStorage(key, name) {
    console.log(name)
    return window.localStorage.setItem(key, name);
}

function retrieveFromLocalStorage(key) {
    console.log(key)
    return window.localStorage.getItem(key);
}

function removeFromLocalStorage(key) {
    console.log(key);
    return window.localStorage.removeItem(key);
}

function clearLocalStorage() {
    return window.localStorage.clear();
}

// methods check
// function tryMethod() {
//     fetch('http://127.0.0.1:4000/delete', {
//         method: "PATCH",
//         mode: "cors",
//         credentials: "same-origin",
//         headers: {
//             "Accept": "*/*",
//             "Content-Type": "application/json"
//         },
//         //body: JSON.stringify(obj)
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('connected',data)
//     })
//     .catch(err => console.log('error connecting', err))
// }

const getBtn = document.getElementById('get-btn');

getBtn.addEventListener('click', () => {
    fetch('http://127.0.0.1:4000/getting', {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(err => console.log('error getting GET data', err))
})