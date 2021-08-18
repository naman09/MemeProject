const { Router } = require('express');
const route = Router();
const { checkToken } = require('./token_validation');
const { createUser, login, updatePreferences, getUserCategories, 
    getFavMemes, getMemeLikeness, checkhealth } = require('../controller');

route.get('/health',checkhealth);
route.post('/create',createUser);
route.post('/login', login);
route.use('/checktoken',checkToken); //Just for testing purpose
route.put('/updatePreferences',updatePreferences); //Internal function
route.get('/userCategories/:UserId',getUserCategories) ;
route.get('/favMemes/:UserId',getFavMemes) ;
route.get('/memeLikeness', getMemeLikeness); //TODO: should run lightning fast ⚡

module.exports =  route;
