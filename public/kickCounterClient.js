function toggleCards() {
    let signup = document.getElementById("signup");
    let login = document.getElementById("login");
    signup.classList.toggle("d-none");
    login.classList.toggle("d-none");
}

function togglePages(page) {
    let login = document.getElementById("loginPage");
    let main = document.getElementById("main");
    //let kickCounter = document.getElementById("kickCounterPage");
    switch (String(page)) {
        case "login":
            login.classList.remove("d-none");
            login.classList.add("d-flex");
            main.classList.add("d-none");
            break;
        case "main":
            main.classList.remove("d-none");
            login.classList.remove("d-flex");
            login.classList.add("d-none");
            break;
        case "kickCounter":
            login.classList.add("d-none");
            login.classList.remove("d-flex");
            main.classList.remove("d-flex");
            main.classList.add("d-none");
            break;
        default:
            login.classList.remove("d-none");
            main.classList.add("d-none");
            main.classList.remove("d-flex");
            break;
    }
}

function goToMain(json) {
    // if (this.header.statusCode !== 500) {
    console.log("back from server with: ");
    console.log(json);
    console.log(this.response);
    const mother = this.response;
    const name = document.getElementById("motherName");
    name.innerHTML = mother.username;


    //  getKickSessions(mother.id);
    // }
    togglePages("main");
}

function loginMother(event) {
    event.preventDefault();
    const form = document.querySelector('#form-login');
    const formData = serialize(form);
    doAjaxCall('POST', formData, '/login', true, goToMain);
}

function signUpMother() {
    const form = document.querySelector('#form-signin');
    const formData = serialize(form);
    doAjaxCall('POST', formData, '/signUp', true, goToMain);

}

function getKickSessions(motherId) {
    doAjaxCall('GET', null, '/kickSessions/' + motherId, false, callback);
}

function doAjaxCall(method, data, url, form, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = callback;
    xhr.open(method, url, true);
    console.log(method);
    console.log(url);
    if (form) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    xhr.responseType = 'json';
    xhr.send(data);
}

/*!
 * Serialize all form data into a query string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 */
var serialize = function (form) {

    // Setup our serialized data
    var serialized = [];

    // Loop through each field in the form
    for (var i = 0; i < form.elements.length; i++) {

        var field = form.elements[i];

        // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
        if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

        // If a multi-select, get all selections
        if (field.type === 'select-multiple') {
            for (var n = 0; n < field.options.length; n++) {
                if (!field.options[n].selected) continue;
                serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
            }
        }

        // Convert field data to a query string
        else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
            serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
        }
    }

    return serialized.join('&');

};

