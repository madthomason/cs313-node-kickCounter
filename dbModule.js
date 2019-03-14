require('dotenv').config();
const {Pool} = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

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

    },

    createKickSession: function () {

    },

    createKick: function () {

    },
}
