const formOne = document.getElementById('form-1');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');

formOne.addEventListener('submit', formSubmitted);

function formSubmitted(e) {
    e.preventDefault();

    let name = nameInput.value;
    let age = ageInput.value;

    console.log('submitted', name, age)
    postData(name, age)
}

function postData(name, age) {
    const obj = { name: name, age: age };
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
    .then(data => storeInLocalStorage(data.name))
    .catch(err => console.log('error posting data', err))
}

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

function storeInLocalStorage(name) {
    console.log(name)
    return window.localStorage.setItem('name', name)
}

function retrieveFromLocalStorage(key) {
    console.log(key)
    return window.localStorage.getItem(key)
}