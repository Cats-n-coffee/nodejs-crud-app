const formOne = document.getElementById('form-1');
const nameInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const ageInput = document.getElementById('age');

formOne.addEventListener('submit', formSubmitted);

function formSubmitted(e) {
    e.preventDefault();

    let name = nameInput.value;
    let password = passwordInput.value;
    let age = ageInput.value;

    postData(name, password, age)
}

function postData(name, password, age) {
    const obj = { name: name, password: password, age: age };
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
            storeInLocalStorage('name', data.name)
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
  
    const userName = retrieveFromLocalStorage('name');
    const message = messageInput.value;

    const obj = { name: userName, message }
    console.log('user', userName, 'message', message)

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
const nameLogin = document.getElementById('name-login');
const passwordLogin = document.getElementById('password-login');

formLogin.addEventListener('submit', loginSubmit);

function loginSubmit(e) {
    e.preventDefault();
    
    const name = nameLogin.value;
    const password = passwordLogin.value;
    const obj = { name: name, password: password };

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
            storeInLocalStorage('name', data.name)
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
        removeFromLocalStorage("name")
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