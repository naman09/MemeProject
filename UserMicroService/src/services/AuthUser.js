const { sign } = require('jsonwebtoken');
const { compare } = require('bcrypt');
const { User } = require('../models');
const { DBError, InputError } = require("../errors")

require('dotenv').config();

class AuthUserService {
    generateToken(userObj) {
        console.log("Generating JWT");
        const jsontoken = sign({ result: userObj }, process.env.TOKEN_SECRET_KEY, { //TODO write secret Key correctly
            expiresIn: "1h"
        });
        console.log("Token :", jsontoken);
        return jsontoken;
    }

    async login(userId, password) {
        console.log("Inside login SVC");
        console.log(userId, password);
        if (!userId || !password) {
            console.log("Invalid UserId or Password");
            throw new InputError("Invalid UserId or Password");
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

                return this.generateToken(userObj);
            } else {
                console.log("Password did not match");
                return null;
            }
        } catch (err) {
            throw new DBError(err);
        }
    }
}

module.exports = AuthUserService;