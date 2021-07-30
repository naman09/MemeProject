const { Router } = require('express');
const route = Router();
const { checkToken } = require('./token_validation');
const { createUser, login , updatePreferences , getUserCategories , getFavMemes } = require('../controller')

route.post('/create',createUser);
route.post('/login', login);
route.use('/checktoken',checkToken);
route.put('/updatePreferences',updatePreferences);
route.get('/userCategories/:UserId',getUserCategories) ;
route.get('/favMemes/:UserId',getFavMemes) ;

module.exports =  route;
