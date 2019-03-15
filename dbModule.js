require('dotenv').config();
const {Pool} = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

//pg config
const pg = require('pg');

module.exports = {
    getMother: function (username, callback) {
        const query = 'SELECT id, username, password FROM mother WHERE username = $1';

        pool.query(query, username, callback);
    },

    getKickSession: function (id, callback) {
        const query = 'SELECT id, start_time, end_time, mother_id FROM kick_session WHERE id = $1';
    },

    getKick: function (id, callback) {
        const query = 'SELECT id, time, kick_session_id FROM kick WHERE id = $1';
    },

    getKickSessions: function (motherId, callback) {
        const query = 'SELECT id, start_time, end_time, mother_id FROM kick_session WHERE mother_id = $1';
    },
    getKicks: function (kickSessionId, callback) {
        const query = 'SELECT id, time, kick_session_id FROM kick WHERE kick_session_id = $1';
    },

    updateKickSession: function () {

    },

    createMother: function (username, password, callback) {
        const query = 'INSERT INTO mother (username, password) VALUES ($1, $2)';

        pool.query(query, [username, password], callback);
    },

    createKickSession: function () {

    },

    createKick: function () {

    }
};
