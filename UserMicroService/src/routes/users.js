const { Router } = require("express");
const { hash } = require('bcrypt');
const CreateUserService = require("../services/CreateUserService");
const AuthUserService = require("../services/AuthUserService");
const createUserServiceInstance = new CreateUserService();
const authUserServiceInstance = new AuthUserService();

const createUser = async (req, res, next) => {
    const userObj = req.body ;
    if (!createUserServiceInstance.validateUserObj(userObj)) {
        return res.status(400).send({ 
            error: {
                code: 400,
                message: "User Object Validation failed",
            }
        });
    }
    try{
        const hashedPassword = await hash(userObj.Password, 10);
        userObj.Password = hashedPassword;
        const results = await createUserServiceInstance.createUser(userObj);
        return res.status(200).send({
            code: 200,
            data: results
        });
    } catch(err) {
        console.log("Error in createUser");
        next(err) ;
    }
    
}

const login = async (req, res, next) => {
    if (!req.body.UserId || !req.body.Password) {
        return res.status(400).send({
            error: {
                code: 400,
                message: "Invalid UserId or Password",
            }
        });
    } 
    
    try {
        const result = await authUserServiceInstance.login(req.body.UserId, req.body.Password);
        if (result) {
            res.status(200).send({
                data: {
                    token: result
                }
            });
        } else {
            res.status(400).send({
                error: {
                    code: 404,
                    message: "Invalid UserId or Password",
                }
            });
        }
    } catch(err){   
        next(err);
    }
}




/*
TODO
route.get("/preferences/:UserId") --> List of category id
route.get("/favmemes/:UserId") --> List of favourite memes
route.put("/updatePreferences")
route.put("/likeness/:MemeId/:UserId")
route.get("/likeness/:MemeId/:UserId")
*/
module.exports = {
    createUser,
    login
}