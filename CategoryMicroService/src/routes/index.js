const { Router } = require('express');
const route = Router();
const { getCategories } = require("../controller");

route.post("/getCategories", getCategories);

module.exports = route;