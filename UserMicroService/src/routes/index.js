const { Router } = require('express');
const route = Router();
const { checkToken } = require('./token_validation');


route.use('/users', require('./users'));

module.exports =  route;
