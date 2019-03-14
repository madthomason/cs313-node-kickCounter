require('dotenv').config();
const {Pool} = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

//pg config
const pg = require('pg');

exports = {
    getMother: function (username, callback) {

    },

    getKickSession: function (id, callback) {

    },

    getKick: function (id, callback) {

    },

    getKickSessions: function (motherId, callback) {

    },
    getKicks: function (kickSessionId, callback) {

    },

    updateKickSession: function () {

    },

    createMother: function (username, password, callback) {
        const mother = {
            id: 1,
            username: username,
            password: password
        };
        console.log('username: ${username}  password: ${password}');
        callback(null, mother);
    },

    createKickSession: function () {

    },

    createKick: function () {

    },
}
