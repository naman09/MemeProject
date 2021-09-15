const { Router } = require('express');
const route = Router();
const { checkToken } = require('../controller/token_validation');
const { createUser, login, userPreferenceUpdater, getUserCategories, 
    getFavMemes, getMemeLikeness } = require('../controller');

route.post('/create', createUser);
route.post('/login', login);
route.use('/checktoken',checkToken); //Just for testing purpose
route.post('/userPreferenceUpdater', userPreferenceUpdater); //Internal function
route.get('/userCategories/:UserId', checkToken, getUserCategories) ;
route.get('/favMemes/:UserId', checkToken, getFavMemes) ;
route.post('/memeLikeness', getMemeLikeness); //UserMemeLikeness

module.exports =  route;
