const { sign } = require('jsonwebtoken');
const { compare } = require('bcrypt');
const { User } = require('../models');

class AuthUserService {
    
    constructor() {}

    async login(userId, password) {
        console.log("Inside login");
        console.log(userId, password);
        if (!userId || !password) {
            console.log("Invalid UserId or Password");
            const error = new Error("Invalid UserId or Password");
            error.isBadRequest = true;
            throw error;
        }
        try {
            const userList = await User.findAll({
                where: {
                    UserId: userId
                }
            });
           
            if (userList.length === 0) { //invalid UserId
                console.log("Invalid UserId");
                return null; 
            }
            const userObj = userList[0].dataValues;
            console.log("User Object: ", userObj);

            // compare supplied password with password in DB
            const isMatch = await compare(password, userObj.Password); 
            if (isMatch) {
                // generate token
                console.log("Password Matched");
                userObj.Password = undefined;
                const jsontoken = sign({ result: userObj }, "qwe1234", { //TODO write secret Key correctly
                    expiresIn: "1h"
                });
                console.log("Token :", jsontoken);
                return jsontoken;
            } else {
                console.log("Password did not match");
                return null;
            }
        } catch(err) {
            console.log("DB Error : " + err);
            const error = new Error("DB Error : " + err);
            error.isOperational = true;
            if (String(err).search("Validation error") != -1) {
                error.isBadRequest = true;
            }
            throw error;
        }
    }
}

module.exports = AuthUserService;