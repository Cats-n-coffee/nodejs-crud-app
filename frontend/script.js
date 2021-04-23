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
//https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
function postData(name, age) {
    const obj = { name: name, age: age };
    console.log(obj)

    fetch('http://127.0.0.1:4000/signup', {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log('error posting data', err))
}