const { Router } = require("express");
const route = Router();
const { User } = require('../../models');
const bcrypt=require('bcrypt') ;

//insert and send a user
route.get('/', (req, res) => {
    res.send({
        "user": {
            "name": "Naman",
            "password": 21,
        }
    });
});

// route.get('/:{userId}', (req, res) => {

// });

function validatePassword(pass) {
    if (pass.length < 8) return false;
    return true;
}

route.get('/create', (req, res) => {
    const saltRounds = 10;
    const plainTextPass = '1234ABCDcb$';
    validatePassword(plainTextPass);

    bcrypt.hash(plainTextPass, saltRounds, function(err, hashedPassword) {
        // Store hash in your password DB.
        User.create({
            UserId:'Shubham',
            Password:hashedPassword,
        }).then((users) => {
            if (users) {
                res.send(users);
            } else {
                res.status(400).send('Error in insert new record');
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(401).send('UserId already exists');
        });
    });
});

module.exports = route;