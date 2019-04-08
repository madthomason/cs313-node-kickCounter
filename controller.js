const bcrypt = require('bcrypt');
const db = require('./dbModel.js');


module.exports = {

    getMother: function (request, response) {
        const username = request.body.username;
        const password = request.body.password;

        db.getMother(username, function (error, result) {

            // Make sure we got a row with the person, then prepare JSON to send back
            if (error || result === null || result.rows.length !== 1) {
                response.status(500).json({success: false, data: error, result: result});
            } else {
                const mother = result.rows[0];
                bcrypt.compare(password, mother.password, function (err, res) {
                    if (res) {
                        // Passwords match
                        request.session.mother = mother;
                        response.status(200).json(mother); //ok
                    } else {
                        // Passwords don't match
                        response.status(400).json({success: false, data: "Wrong Username or password"});
                    }
                });
            }
        });
    },

    logout: function (request, response) {
        if (request.session.mother) {
            request.session.destroy();
            response.json({success: true});
        } else {
            response.json({success: false});
        }
    },

    getKickSession: function (request, response) {
        const kickSessionId = request.params.kickSessionId;

        if (isNaN(kickSessionId)) {
            response.status(500).json({success: false, data: "Invalid kickSessionId"});
        }
        db.getKickSession(kickSessionId, function (error, result) {
            if (error || result == null || result.rows.length !== 1) {
                response.status(500).json({success: false, data: error});
            } else {
                const kickSession = result.rows[0];
                request.session.kickSession = kickSession;
                response.status(200).json(kickSession);
            }
        });
    },

    getKick: function (request, response) {
        const kickId = request.params.kickId;

        if (isNaN(kickId)) {
            response.status(500).json({success: false, data: "Invalid kickId"});
        }
        db.getKick(kickId, function (error, result) {

            if (error || result == null || result.rows.length !== 1) {
                response.status(500).json({success: false, data: error});
            } else {
                const kick = result.rows[0];
                response.status(200).json(kick);
            }
        });
    },

    getKickSessions: function (request, response) {
        const motherId = (typeof request.session.mother !== 'undefined') ? request.params.motherId : request.session.mother.id;

        db.getKickSessions(motherId, function (error, result) {
            if (error || result === null) {
                response.status(500).json({success: false, data: error});
            } else {
                const kickSessions = result.rows;
                response.status(200).json(kickSessions);
            }
        });

    },

    getKicks: function (request, response) {
        const kickSessionId = request.session.kickSession == null ? request.params.kickSessionId : request.session.kickSession.id;

        if (isNaN(kickSessionId)) {
            response.status(500).json({success: false, data: "Invalid kickSessionId"});
        }
        db.getKicks(kickSessionId, function (error, result) {

            if (error || result == null) {
                response.status(500).json({success: false, data: error});
            } else {
                const kicks = result.rows;
                response.status(200).json(kicks);
            }
        });
    },

    updateKickSession: function (request, response) {
        const kickSessionId = (typeof request.session.kickSession !== 'undefined') ? request.session.kickSession.id : null;
        if (kickSessionId === null) {
            response.status(500).json({success: false, data: "No kickSession, please start one"});
        }
        db.updateKickSession(kickSessionId, function (error, result) {

            if (error || result == null) {
                response.status(500).json({success: false, data: error});
            } else {
                const kickSession = result.rows[0];
                request.session.kickSession = undefined;
                if (request.session.mother){
                response.status(200).json(request.session.mother);
                } else {
                    response.status(500).json({success: false, data: "No session, please login"});
                }
            }
        });
    },

    createMother: function (request, response) {
        const username = request.body.username;

        bcrypt.hash(request.body.password, 10, (err, password) => {
            // Store hash in database
            db.createMother(username, password, function (error, result) {

                // Make sure we got a row with the person, then prepare JSON to send back
                if (error || result == null) {
                    response.status(500).json({success: false, data: error});
                } else {
                    const mother = result.rows[0];
                    //TODO: Set motherId to session
                    request.session.mother = mother;
                    response.status(200).json(mother);
                }
            });
        });

    },

    createKickSession: function (request, response) {
        const motherId = request.session.mother.id;
        if (typeof motherId === undefined) {
            response.status(400).json({success: false, data: "No session, please login"})
        }
        db.createKickSession(motherId, function (error, result) {

            if (error || result == null) {
                response.status(500).json({success: false, data: error});
            } else {
                const kickSession = result.rows[0];
                kickSession.kicks = [];
                db.createKick(kickSession.start_time, kickSession.id, function (error, result) {
                    if (error || result == null) {
                        response.status(500).json({success: false, data: error});
                    } else {
                        kickSession.kicks = result.rows;
                        request.session.kickSession = kickSession;
                        response.status(200).json(kickSession);
                    }
                });
            }
        });
    },

    createKick: function (request, response) {
        const kickSessionId = (typeof request.session.kickSession !== 'undefined') ? request.session.kickSession.id : request.params.kickSessionId;
        if (kickSessionId === null) {
            response.status(500).json({success: false, data: "No kickSession, please start one"});
        }
        db.createKick(null, kickSessionId, function (error, result) {

            // Make sure we got a row with the person, then prepare JSON to send back
            if (error || result == null) {
                response.status(500).json({success: false, data: error});
            } else {
                const kick = result.rows[0];
                response.status(200).json(kick);
            }
        });
    }

};
