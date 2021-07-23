const { User } = require('../models');

/*
    Create user in the database after validating it
*/
class CreateUserService {

    constructor () {}

    validateUserObj(userObj) {
        if (!userObj) {
            return false;
        } else if (!userObj.UserId) {
            return false;
        }
        return this.validatePassword(userObj.Password);
    }

    validatePassword(pass) {
        console.log("Inside validatePassword");
        if (pass.length < 8) return false;
        if (pass.match(/.*[A-Z].*/i)!=pass) return false;
        if (pass.match(/.*[a-z].*/i)!=pass) return false;
        if (pass.match(/.*[0-9].*/i)!=pass) return false;
        if (pass.match(/.*\W.*/i)!=pass) return false;
        return true;
    }

    createUser(userObj, callBack) {
        console.log("Inside create user");

        User.create({
            UserId: userObj.UserId,
            Password: userObj.Password
        }).then((users) => {
            if (users) {
                console.log("User created successfully");
                users.Password = undefined;
                callBack(null, { success: 1, data: users });
            } else { 
                console.log("Error inserting new record"); //TODO WHEN IT IS HIT?
                callBack(null, { success: 0, message:'Error in insert new record' });
            }
        })
        .catch((err) => {  
            callBack(err, { success: 0 });
        });

    }
}
module.exports = CreateUserService;