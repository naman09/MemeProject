const { sign } = require('jsonwebtoken');
const { compare } = require('bcrypt');
const { User } = require('../models');

class AuthUserService {
    
    constructor() {}

    async login(userId, password) {
        console.log("Inside login");
        if (!userId || !password) {
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
                return null;
            }
        } catch(err) {
            const error = new Error("DB Error : " + err.message);
            error.isOperational = true;
            throw error;
        }
    }
}

module.exports = AuthUserService;