const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const router = express.Router();
const bodyParser = require('body-parser');
const controller = require('./controller.js');

express()
  .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/kickCounter'))

    .post('/login', controller.getMother)
    .post('/signUp', controller.createMother)

    .get('/kick/:kickId', controller.getKick)
    .post('/kick', controller.createKick)
    .get('/kickSession/kick/:kickSessionId', controller.getKicks)

    .get('/kickSession/:kickSessionId', controller.getKickSession)
    .put('/kickSession/:kickSessionId', controller.updateKickSession)
    .post('/kickSession', controller.createKickSession)
    .get('/kickSessions/:motherId', controller.getKickSessions)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));


