require('dotenv').config();
const {Pool} = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

module.exports = {
    getMother: function (username, callback) {
        const query = 'SELECT id, username, password FROM mother WHERE username = $1';

        pool.query(query, [username], callback);
    },

    getKickSession: function (id, callback) {
        const query = 'SELECT ks.id, ks.start_time, ks.end_time, ks.mother_id, json_agg(k.*) as kicks\n' +
            'FROM kick_session ks\n' +
            'JOIN kick k ON ks.id = k.kick_session_id\n' +
            'WHERE ks.id = $1\n' +
            'GROUP BY ks.id';
        pool.query(query, [id], callback);
    },

    getKick: function (id, callback) {
        const query = 'SELECT id, time, kick_session_id FROM kick WHERE id = $1';
        pool.query(query, [id], callback);
    },

    getKickSessions: function (motherId, callback) {
        const query = 'SELECT ks.id, ks.start_time, ks.end_time, ks.mother_id, json_agg(k.*) as kicks\n' +
            'FROM kick_session ks\n' +
            'JOIN kick k ON ks.id = k.kick_session_id\n' +
            'WHERE ks.mother_id = $1\n' +
            'GROUP BY ks.id';
        pool.query(query, [motherId], callback);
    },

    getKicks: function (kickSessionId, callback) {
        const query = 'SELECT id, time, kick_session_id FROM kick WHERE kick_session_id = $1';
        pool.query(query, [kickSessionId], callback);

    },

    updateKickSession: function (kickSessionId, callback) {
        const query = 'UPDATE kick_session SET end_time = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, start_time, end_time, mother_id ';
        pool.query(query, [kickSessionId], callback);
    },

    createMother: function (username, password, callback) {
        const query = 'INSERT INTO mother (username, password) VALUES ($1, $2) RETURNING id, username, password';

        pool.query(query, [username, password], callback);
    },

    createKickSession: function (motherId, callback) {
        const query = 'INSERT INTO kick_session (start_time, mother_id ) VALUES (CURRENT_TIMESTAMP, $1) RETURNING id, start_time, end_time, mother_id ';
        pool.query(query, [motherId], callback);
    },

    createKick: function (time, kickSessionId, callback) {

        if (time === null) {
            let query = 'INSERT INTO kick (time, kick_session_id) VALUES (CURRENT_TIMESTAMP, $1) RETURNING id, time, kick_session_id';
            pool.query(query, [kickSessionId], callback);
        } else {
            let query = 'INSERT INTO kick (time, kick_session_id) VALUES ($1, $2) RETURNING id, time, kick_session_id';
            pool.query(query, [time, kickSessionId], callback);
        }

    }
};
