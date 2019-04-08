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
            kickCounter.classList.add("d-flex");
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
    if (this.response.statusCode >= 400) {
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
                        '<div class="d-flex flex-column vw100">\n' +
                        '            <div class="d-flex justify-content-around">\n' +
                        `               <h3>${new Date(k.start_time).toDateString()}</h3><h3>Kicks: ${k.kicks.length}</h3>\n` +
                        `<button onclick="getKickSessionGraph([${k.kicks}], myChart${k.id})" ${disabled} class="btn btn-secondary"><i class="fas fa-chevron-down"></i></button>` +
                        '            </div>\n' +
                        '            <div class="d-flex ml-3">\n' +
                        `                <h3>Duration: ${getDuration(k.end_time, k.start_time)}</h3>\n` +
                        '            </div>\n' +
                        '<div id="kickSessionGraph" class="collapse"><canvas id=`myChart${k.id}` width="400" height="400"></canvas>' +
                        '</div><hr></div>\n';
                });

                kickSessionList.innerHTML = kickSessionHtml;
            }
        });

        togglePages("main");
    }

}

function goToKickSession(json) {
    console.log("back from server with: ");
    console.log(json);
    console.log(this.response);
    if (this.response.statusCode >= 400) {
        togglePages("login");
        alert(this.response.data);
    } else {
        const kickSession = this.response;
        const isoStart = moment(kickSession.start_time);
        const zone = isoStart.zone()/60;
        let start_time =  isoStart.subtract(zone, 'hours');
        document.getElementById("startTime").innerHTML = start_time.format('MMM DD YYYY h:mm:ss:SSS a');
        const kickList = document.getElementById("kicksContainer");

        let kickNum = 1;
        let kicksHtml = '';
        kickSession.kicks.forEach(kick => {
            let isoTime = moment(kick.time);
            let time = isoTime.subtract(zone, 'hours');
            kicksHtml +=
                `<div class="d-flex flex-column kicks" id="${kickNum}" >\n` +
                '   <div class="d-flex justify-content-around">\n' +
                `      <h3>Kick #${kickNum}</h3><h3>${time.format('h:mm:ss:SSS a')}</h3>\n` +
                '   </div>\n' +
                '</div><hr></div>\n';
            kickNum++;
        });
        kickList.innerHTML = kicksHtml;
    }
    togglePages("kickCounter");
}

function updateKickSession(json) {
    //TODO: Check header status code
    console.log("back from server with: ");
    console.log(json);
    console.log(this.response);
    if (this.response.statusCode >= 400) {
        togglePages("login");
        alert(this.response.data);
    } else {
        const kick = this.response;
        const kickList = document.getElementsByClassName("kicks");
        let kickNum = +kickList.item(kickList.length - 1).id + 1;
        let kicksHtml =
                `<div class="d-flex flex-column kicks" id="${kickNum}" >\n` +
                '   <div class="d-flex justify-content-around">\n' +
                `      <h3>Kick #${kickNum}</h3><h3>${kick.time}</h3>\n` +
                '   </div>\n' +
                '</div><hr></div>\n';

        document.getElementById("kicksContainer").innerHTML += kicksHtml;
    }
}

function loginMother(event) {
    event.preventDefault();
    const form = document.querySelector('#form-login');
    const formData = serialize(form);
    doAjaxCall('POST', formData, '/login', true, goToMain);
}

function logout() {
    doAjaxCall('GET', null, '/logout', true, function (response) {
        if (this.response.success) {
            togglePages('login');
        } else {
            console.error('error in session');
            togglePages('login');
        }
    });
}

function signUpMother() {
    const form = document.querySelector('#form-signin');
    const formData = serialize(form);
    doAjaxCall('POST', formData, '/signUp', true, goToMain);

}

function getKickSessions(motherId, callback) {
    doAjaxCall('GET', null, '/kickSessions/' + motherId, false, callback);
}

function createKickSession() {
    doAjaxCall('POST', null, '/kickSession', false, goToKickSession);
}

function finishKickSession() {
    doAjaxCall('POST', null, '/end/kickSession', false, goToMain);
}

function createKick() {
    doAjaxCall('POST', null, '/kick', false, updateKickSession);
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
    const collapseDiv = document.getElementById(ctxId);
    collapseDiv.classList.toggle('collapse');

    let myChart = new Chart(collapseDiv.getContext('2d'), {
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
    const max = new Date(kicks[kicks.length - 1].time).getMinutes();
    let minutes = [];

    kicks.forEach(kick => {
        minutes.push(new Date(kick.time).getMinutes());
    });
    let minutesAgg = [];
    let labels = [];
    for (let i = min; i <= max; i++) {
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

