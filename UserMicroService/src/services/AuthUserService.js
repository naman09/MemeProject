const { sign } = require('jsonwebtoken');
const { compare } = require('bcrypt');
const { User } = require('../models');

class AuthUserService {
    
    constructor() {}

    login(userObj, callBack) {
        console.log("Inside login")
        User.findAll({
            where: {
                UserId: userObj.UserId
            }
        }).then((loggedUser)=> {
            if (!loggedUser) {
                console.log("Error: User with this UserId does not exists");
                callBack(null,{ message: "User with this UserId does not exists" });
            }
            loggedUser = loggedUser[0].dataValues;
            console.log("User: ", loggedUser);
            console.log(userObj.Password, " ", loggedUser.Password);

            compare(userObj.Password, loggedUser.Password).then((result) => {
                if (result) {
                    loggedUser.Password = undefined; //Don't want to include password in token
                    const jsontoken = sign({ result: loggedUser }, "qwe1234", { //TODO write secret Key correctly
                        expiresIn: "1h"
                    });
                    callBack(null, {
                        token: jsontoken
                    });
                } else {
                    callBack(null,{ message: "Invalid password" });
                }
            });


        })
        .catch(err => {
            callBack(err, {
                success: 0
            });
        });    
    }
    
}

module.exports = AuthUserService;