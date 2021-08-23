const { User } = require('../models');
const { hash } = require('bcrypt');
const { getHashes } = require("crypto");

/*
    Create user in the database after validating it
*/
class CreateUserService {

    constructor () {}

    validateUserObj(userObj) {
        console.log("Inside validateUserObj");
        if (!userObj) {
            return false;
        } else if (!userObj.UserId) {
            return false;
        } else if (typeof(userObj.UserId) !== "string") {
            return false;
        }
        return this.validatePassword(userObj.Password);
    }

    validatePassword(pass) {
        console.log("Inside validatePassword");
        if (typeof(pass) !== "string") return false;
        if (pass.length < 8) return false;
        if (pass.match(/.*[A-Z].*/i)!=pass) return false;
        if (pass.match(/.*[a-z].*/i)!=pass) return false;
        if (pass.match(/.*[0-9].*/i)!=pass) return false;
        if (pass.match(/.*\W.*/i)!=pass) return false;
        return true;
    }

    async createUser(userObj) {
        console.log("Inside createUser");
        if (!this.validateUserObj(userObj)) {
            const error = new Error("User Object Validation failed");
            error.isBadRequest = true;
            throw error ;
        }
        try{
            const hashedPassword = await hash(userObj.Password, 10);
            userObj.Password = hashedPassword;
            let user = await User.create({
                UserId: userObj.UserId,
                Password: userObj.Password
            });
            user = user.dataValues;
            console.log(user) ;
            if(user){
                console.log("User created successfully");
                return user;
            }
            else {
                console.log("User creation failed");
                const error = new Error("Insertion failed : ");
                error.isOperational = false;
                throw error;
            }
        } catch(err) {
            const errMessage = String(err);
            console.log("DB Error : " + errMessage);
            const error = new Error("DB Error : " + errMessage);
            error.isOperational = true; //TODO either remove or keep everywhere
            if (errMessage.search("Validation error") !== -1)
                error.isBadRequest = true;
            throw error;
        }
    }
}
module.exports = CreateUserService;