function toggleCards() {
    let signup = document.getElementById("signup");
    let login = document.getElementById("login");
    signup.classList.toggle("d-none");
    login.classList.toggle("d-none");
}

function togglePages(page) {
    let login = document.getElementById("loginPage");
    let main = document.getElementById("main");
    let kickCounter = document.getElementById("kickCounterPage");
    switch (String(page)) {
        case "login":
            login.classList.remove("d-none");
            login.classList.add("d-flex");
            main.classList.add("d-none");
            kickCounter.classList.add("d-none");
            break;
        case "main":
            main.classList.remove("d-none");
            main.classList.add("d-flex");
            login.classList.remove("d-flex");
            login.classList.add("d-none");
            kickCounter.classList.add("d-none");
            break;
        case "kickCounter":
            kickCounter.classList.remove("d-none");
            login.classList.add("d-none");
            login.classList.remove("d-flex");
            main.classList.remove("d-flex");
            main.classList.add("d-none");
            break;
        default:
            login.classList.remove("d-none");
            main.classList.add("d-none");
            main.classList.remove("d-flex");
            kickCounter.classList.add("d-none");
            kickCounter.classList.remove("d-flex");
            break;
    }
}

function goToMain(json) {
    //TODO: Check header status code
    console.log("back from server with: ");
    console.log(json);
    console.log(this.response);
    if (this.response.success === false) {
        togglePages("login");
        alert(this.response.data);
    } else {
        const mother = this.response;
        const name = document.getElementById("motherName");
        const kickSessionList = document.getElementById("kickSessionList");
        name.innerHTML = mother.username;
// console.log(`mother.id = ${mother.id}`);
        getKickSessions(mother.id, function (json) {

            console.log("back from server with: ");
            console.log(json);
            console.log(this.response);
            if (this.response.success !== false) {
                const kickSessions = this.response;

                let kickSessionHtml = '';
                kickSessions.forEach(k => {
                    const disabled = ((k.kicks === [] || k.kicks.length === 1) ? 'disabled' : '');
                    kickSessionHtml +=
                        '<div class="d-flex flex-column">\n' +
                        '            <div class="d-flex ">\n' +
                        `               <h3>${new Date(k.start_time).toDateString()}</h3> - <h3>Kicks: ${k.kicks.length}</h3>\n` +
                        `<button onclick="getKickSessionGraph(${k.kicks}, myChart${k.id})" ${disabled}><i class="fas fa-chevron-down"></i></button>` +
                        '            </div>\n' +
                        '            <div class="d-flex ">\n' +
                        `                <h3>Duration: ${getDuration(k.end_time, k.start_time)}</h3>\n` +
                        '            </div>\n' +
                        '<div id="kickSessionGraph" class="d-flex"><canvas id=`myChart${k.id}` width="400" height="400"></canvas>' +
                        '</div><hr></div>\n';
                });

                kickSessionList.innerHTML = kickSessionHtml;
            }
        });

        togglePages("main");
    }

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

function getKickSessions(motherId, callback) {
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

function getKickSessionGraph(kicks, ctxId) {
    let data = getData(kicks);
    console.log(data);
    let ctx = document.getElementById(ctxId).getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Kicks per Minute',
                data: data.data,
                // backgroundColor: [
                //     'rgba(255, 99, 132, 0.2)',
                //     'rgba(54, 162, 235, 0.2)',
                //     'rgba(255, 206, 86, 0.2)',
                //     'rgba(75, 192, 192, 0.2)',
                //     'rgba(153, 102, 255, 0.2)',
                //     'rgba(255, 159, 64, 0.2)'
                // ],
                // borderColor: [
                //     'rgba(255, 99, 132, 1)',
                //     'rgba(54, 162, 235, 1)',
                //     'rgba(255, 206, 86, 1)',
                //     'rgba(75, 192, 192, 1)',
                //     'rgba(153, 102, 255, 1)',
                //     'rgba(255, 159, 64, 1)'
                // ],
                // borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function getData(kicks) {
    const min = new Date(kicks[0].time).getMinutes();
    const max = new Date(kicks[kicks.length].time).getMinutes();
    let minutes = [];

    kicks.forEach(kick => {
        minutes.push(new Date(kick.time).getMinutes());
    });
    let minutesAgg = [];
    let labels = [];
    for (let i  = min; i <= max; i++) {
        labels.push(i);
        minutesAgg.push(minutes.filter(minute => minute === i).length);
    }
    return {
        min: min,
        max: max,
        labels: labels,
        data: minutesAgg
    };
}

/*!
 * Get duration from 2 timestamps
 * Derived from, https://stackoverflow.com/questions/16767301/calculate-difference-between-2-timestamps-using-javascript
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 */
function getDuration(timestampEnd, timestampStart) {
    var difference = new Date(timestampEnd).getTime() - new Date(timestampStart).getTime();

    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60;

    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60;

    var secondsDifference = Math.floor(difference / 1000);

    return `${hoursDifference}:${minutesDifference}:${secondsDifference}`;
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

