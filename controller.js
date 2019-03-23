const bcrypt = require('bcrypt');
const db = require('./dbModel.js');
const { forEach } = require('p-iteration');


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
                        response.status(200).json(mother); //ok
                    } else {
                        // Passwords don't match
                        response.status(400).json({success: false, data: "Wrong Username or password"});
                    }
                });
            }
        });
    },

    getKickSession: function (request, response) {
        const kickSessionId = request.param.kickSessionId;

        if (isNaN(kickSessionId)) {
            response.status(500).json({success: false, data: "Invalid kickSessionId"});
        }
        db.getKickSession(kickSessionId, function (error, result) {

            if (error || result == null || result.rows.length !== 1) {
                response.status(500).json({success: false, data: error});
            } else {
                const kickSession = result.rows[0];
                kickSession.kicks = [];
                db.getKicks(kickSessionId, addKicksToKickSession.bind({response: response, kickSession: kickSession}));
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
        const motherId = request.params.motherId;

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
        const kickSessionId = request.params.kickSessionId;

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
        const kickSessionId = request.params.kickSessionId;
        const endTime = request.params.endTime;

        if (isNaN(kickSessionId)) {
            response.status(500).json({success: false, data: "Invalid kickSessionId cannot update"});
        }
        db.updateKickSession(kickSessionId, endTime, function (error, result) {

            if (error || result == null) {
                response.status(500).json({success: false, data: error});
            } else {
                const kickSession = result.rows;
                response.status(200).json(kickSession);
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
                    response.status(200).json(mother);
                }
            });
        });

    },
    createKickSession: function (request, response) {
        const startTime = request.body.startTime;
        const motherId = request.body.motherId; //or from cookies?

        // Store hash in database
        db.createKickSession(startTime, motherId, function (error, result) {

            // Make sure we got a row with the person, then prepare JSON to send back
            if (error || result == null) {
                response.status(500).json({success: false, data: error});
            } else {
                const kickSession = result.rows[0];
                kickSession.kicks = [];
                db.createKick(startTime, kickSession.id, addKicksToKickSession.bind({
                    response: response,
                    kickSession: kickSession
                }));
            }
        });
    },
    createKick: function (request, response) {
        const time = request.body.time;
        const kickSessionId = request.body.kickSessionId; //or from cookies?

        db.createKick(time, kickSessionId, function (error, result) {

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

function addKicksToKickSession(error, result) {
    if (error || result === null) {
        return [];
    } else {
        return result.rows;
    }
    // if (result !== null) {
    //     this.kickSession.kicks = result.rows;
    // }
    // if (this.response) {
    //     if (error || result === null) {
    //         this.response.status(500).json({success: false, data: error});
    //     } else {
    //         this.response.status(200).json(this.kickSession);
    //     }
    // }

}
