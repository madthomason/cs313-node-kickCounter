const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const db = require('./dbModule');
const router = express.Router();

//pg config
const pg = require('pg');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/kickCounter'))

    .post('/login', getMother)
    .post('/signUp', createMother)

    .get('/kick/:kickId', getKick)
    .post('/kick', createKick)
    .get('/kickSession/kick/:kickSessionId', getKicks)

    .get('/kickSession/:kickSessionId', getKickSession)
    .put('/kickSession/:kickSessionId', updateKickSession)
    .post('/kickSession', createKickSession)
    .get('/kickSessions/:motherId', getKickSessions)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));


function getMother(request, response) {
    const username = request.body.username;
    const hashedPassword = request.body.password; //hash it


    // TODO: We should really check here for a valid id before continuing on...
    db.getMother(username, function(error, result) {
        // This is the callback function that will be called when the DB is done.
        // The job here is just to send it back.

        // Make sure we got a row with the person, then prepare JSON to send back
        if (error || result == null || result.length !== 1) {
            response.status(500).json({success: false, data: error});
        } else {
            const mother = result[0];
            if (mother.password === hashedPassword) { //check password against given password
                response.status(200).json(mother); //ok
            }
            response.status(200).json(); //wrong password
        }
    });
}

function getKickSession(request, response) {
    const kickSessionId = request.param.kickSessionId;

    // TODO: We should really check here for a valid id before continuing on...
    db.getKickSession(kickSessionId, function(error, result) {
        // This is the callback function that will be called when the DB is done.
        // The job here is just to send it back.

        // Make sure we got a row with the person, then prepare JSON to send back
        if (error || result == null || result.length !== 1) {
            response.status(500).json({success: false, data: error});
        } else {
            const kickSession = result[0];
            response.status(200).json(kickSession);
        }
    });
}

function getKick(request, response) {
    const kickId = request.query.kickId;

    // TODO: We should really check here for a valid id before continuing on...
    db.getKick(kickId, function(error, result) {
        // This is the callback function that will be called when the DB is done.
        // The job here is just to send it back.

        // Make sure we got a row with the person, then prepare JSON to send back
        if (error || result == null || result.length !== 1) {
            response.status(500).json({success: false, data: error});
        } else {
            const kick = result[0];
            response.status(200).json(kick);
        }
    });
}

function getKickSessions(request, response) {
    const motherId = request.query.motherId;

    // TODO: We should really check here for a valid id before continuing on...
    db.getKickSessions(motherId, function(error, result) {
        // This is the callback function that will be called when the DB is done.
        // The job here is just to send it back.

        // Make sure we got a row with the person, then prepare JSON to send back
        if (error || result == null) {
            response.status(500).json({success: false, data: error});
        } else {
            const kickSessions = result;
            response.status(200).json(kickSessions);
        }
    });
}

function getKicks(request, response) {
    const kickSessionId = request.query.kickSessionId;

    // TODO: We should really check here for a valid id before continuing on...
    db.getKicks(kickSessionId, function(error, result) {
        // This is the callback function that will be called when the DB is done.
        // The job here is just to send it back.

        // Make sure we got a row with the person, then prepare JSON to send back
        if (error || result == null) {
            response.status(500).json({success: false, data: error});
        } else {
            const kicks = result;
            response.status(200).json(kicks);
        }
    });
}

function updateKickSession(request, response) {

}

function createMother(request, response) {
    const username = request.body.username;
    const password = request.body.password; //hash
    db.createMother(username, password, function(error, result) {
        // This is the callback function that will be called when the DB is done.
        // The job here is just to send it back.

        // Make sure we got a row with the person, then prepare JSON to send back
        if (error || result == null) {
            response.status(500).json({success: false, data: error});
        } else {
            const mother = result;
            response.status(200).json(mother);
        }
    });
}

function createKickSession(request, response) {

}

function createKick(request, response) {

}
