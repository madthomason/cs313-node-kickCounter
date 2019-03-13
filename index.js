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
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


function getMother(request, response) {
    const id = request.query.id;

    // TODO: We should really check here for a valid id before continuing on...
    db.getMother(id, function(error, result) {
        // This is the callback function that will be called when the DB is done.
        // The job here is just to send it back.

        // Make sure we got a row with the person, then prepare JSON to send back
        if (error || result == null || result.length !== 1) {
            response.status(500).json({success: false, data: error});
        } else {
            const mother = result[0];
            response.status(200).json(mother);
        }
    });
}

function getKickSession(request, response) {
    const id = request.query.id;

    // TODO: We should really check here for a valid id before continuing on...
    getPersonFromDb(id, function(error, result) {
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
    const id = request.query.id;

    // TODO: We should really check here for a valid id before continuing on...
    getPersonFromDb(id, function(error, result) {
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
    const id = request.query.id;

    // TODO: We should really check here for a valid id before continuing on...
    getPersonFromDb(id, function(error, result) {
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
    const id = request.query.id;

    // TODO: We should really check here for a valid id before continuing on...
    getPersonFromDb(id, function(error, result) {
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

}

function createKickSession(request, response) {

}

function createKick(request, response) {

}
