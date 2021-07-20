const { Router } = require("express");

const route = Router();

//insert and send a user
route.get('/', (req, res) => {

    

    res.send({
        "user": {
            "name": "Naman",
            "password": 21,
        }
    });
});


module.exports = route;