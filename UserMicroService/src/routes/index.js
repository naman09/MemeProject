const { Router } = require('express');
const route = Router();
const { checkToken } = require('./token_validation');
const { createUser, login , updatePreferences } = require('./users')

route.post('/create',createUser);
route.post('/login', login);
route.use('/checktoken',checkToken);
route.put('/updatePreferences',updatePreferences);

module.exports =  route;
