const { Router } = require("express");
const route = Router();
const CreateUserService = require("../services/CreateUserService");
const AuthUserService = require("../services/AuthUserService");

const { hash } = require('bcrypt');

const createUserServiceInstance = new CreateUserService();
const authUserServiceInstance = new AuthUserService();

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

route.post('/create', (req, res) => {
    console.log("Inside create user api");
    console.log(req.body);

    const userObj = req.body;

    if (!createUserServiceInstance.validateUserObj(userObj)) {
        return res.status(400).send({ success: 0, message: "User Validation failed"});
    }
    
    hash(userObj.Password, 10).then((hashedPassword) => {
        userObj.Password = hashedPassword;
        createUserServiceInstance.createUser(userObj, (err, results) => {
            if (err) {
                console.log(err.message, ": ", err.errors[0].message);
                return res.status(500).send({
                  success: 0,
                  message: err.errors[0].message
                });
              }
              return res.status(200).send({
                success: 1,
                message: "User created successfully",
                data: results
              });
        });
    });

});

route.post('/login', (req, res) => {
    authUserServiceInstance.login(req.body, (err, results) => {
        if (err) {
            res.status(400).send({
                success: 0,
                message: err.message
            });
        } else {
            res.status(200).send({
                success: 1,
                message: "Login Successful",
                data: results
            });
        }
    });
    
})

module.exports = route;