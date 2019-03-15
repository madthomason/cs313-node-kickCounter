const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const router = express.Router();
const model = require('./models');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/kickCounter'))

    .post('/login', model.getMother)
    .post('/signUp', model.createMother)

    .get('/kick/:kickId', model.getKick)
    .post('/kick', model.createKick)
    .get('/kickSession/kick/:kickSessionId', model.getKicks)

    .get('/kickSession/:kickSessionId', model.getKickSession)
    .put('/kickSession/:kickSessionId', model.updateKickSession)
    .post('/kickSession', model.createKickSession)
    .get('/kickSessions/:motherId', model.getKickSessions)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));


