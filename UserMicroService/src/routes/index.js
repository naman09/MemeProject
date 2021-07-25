const { Router } = require('express');
const route = Router();
const { checkToken } = require('./token_validation');
const { createUser, login } =require('./users')

route.use('/create',createUser);
route.use('/login', login);

module.exports =  route;
