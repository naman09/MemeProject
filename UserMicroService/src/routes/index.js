const { Router } = require('express');
const route = Router();
const { checkToken } = require('./token_validation');
const { createUser, login, updateUserPreferences, getUserCategories, 
    getFavMemes, getMemeLikeness } = require('../controller');

route.post('/create',createUser);
route.post('/login', login);
route.use('/checktoken',checkToken); //Just for testing purpose
route.put('/updateUserPreferences',updateUserPreferences); //Internal function
route.get('/userCategories/:UserId',getUserCategories) ;
route.get('/favMemes/:UserId',getFavMemes) ;
route.post('/memeLikeness', getMemeLikeness); //TODO: should run lightning fast ⚡

module.exports =  route;
