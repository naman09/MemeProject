const { User } = require('../models');

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
        } else if (!(userObj.UserId instanceof String)) {
            return false;
        }
        return this.validatePassword(userObj.Password);
    }

    validatePassword(pass) {
        console.log("Inside validatePassword");
        if (!(pass instanceof String)) return false;
        if (pass.length < 8) return false;
        if (pass.match(/.*[A-Z].*/i)!=pass) return false;
        if (pass.match(/.*[a-z].*/i)!=pass) return false;
        if (pass.match(/.*[0-9].*/i)!=pass) return false;
        if (pass.match(/.*\W.*/i)!=pass) return false;
        return true;
    }

    async createUser(userObj) {
        console.log("Inside createUser");
        try{
            let user = await User.create({
                UserId: userObj.UserId,
                Password: userObj.Password
            });
            user = user.dataValues;
            await console.log(user) ;
            if(user){
                console.log("User created successfully");
                return user;
            }
            else {
                console.log("User creation failed");
                const error = new Error("Insertion failed : " + err.message);
                error.isOperational = false;
                throw error;
            }
        } catch(err) {
            const errMessage = String(err);
            console.log("DB Error : " + errMessage);
            const error = new Error("DB Error : " + errMessage);
            error.isOperational = true;
            if (errMessage.search("Validation error") !== -1)
                error.isBadRequest = true;
            throw error;
        }
    }
}
module.exports = CreateUserService;