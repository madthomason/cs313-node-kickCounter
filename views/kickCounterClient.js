

function toggleCards() {
    let signup = document.getElementById("signup");
    let login = document.getElementById("login");
    signup.classList.toggle("d-none");
    login.classList.toggle("d-none");
}

function doAjaxCall(method, data = null, url, callback) {

    let xhr = new XMLHttpRequest();
    xhr.onload = callback;
    xhr.open(method, url, true);
    xhr.responseType = 'json';
    xhr.send();
}
