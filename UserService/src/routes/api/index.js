const { Router } = require('express');
const route = Router();

route.use('/users',require('./users'));


module.exports =  route;
