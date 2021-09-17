const { User } = require('../models');
const { hash } = require('bcrypt');
const { getHashes } = require("crypto");
const { DBError, InputError } = require("../errors");
const { sign } = require('jsonwebtoken');
require('dotenv').config();
/*
    Create user in the database after validating it
*/
class CreateUserService {

  constructor() { }

  validateUserObj(userObj) {
    console.log("Inside validateUserObj");
    if (!userObj) {
      console.log("UserObj cannot be null");
      return false;
    } else if (!userObj.UserId) {
      console.log("UserId cannot be undefined");
      return false;
    } else if (typeof (userObj.UserId) !== "string") {
      console.log("UserId expected string found " + typeof (userObj.UserId));
      return false;
    }
    return this.validatePassword(userObj.Password);
  }

  validatePassword(pass) {
    console.log("Inside validatePassword");
    if (typeof (pass) !== "string") {
      console.log("Password expected string found " + typeof (oass));
      return false;
    }
    if (pass.length < 8) return false;
    if (pass.match(/.*[A-Z].*/i) != pass) return false;
    if (pass.match(/.*[a-z].*/i) != pass) return false;
    if (pass.match(/.*[0-9].*/i) != pass) return false;
    if (pass.match(/.*\W.*/i) != pass) return false;
    console.log("Password strength is good enough");
    return true;
  }

  generateToken(userObj) {
    console.log("Generating JWT");
    const jsontoken = sign({ result: userObj }, process.env.TOKEN_SECRET_KEY, { //TODO write secret Key correctly
      expiresIn: "1h"
    });
    console.log("Token :", jsontoken);
    return jsontoken;
  }

  async createUser(userObj) {
    console.log("Inside createUser");
    if (!this.validateUserObj(userObj)) {
      throw new InputError("User Object Validation failed");
    }
    try {
      const hashedPassword = await hash(userObj.Password, 10);
      userObj.Password = hashedPassword;
      let user = await User.create({
        UserId: userObj.UserId,
        Password: userObj.Password
      });
      user = user.dataValues;
      console.log(user);
      if (user) {
        console.log("User created successfully");
        user.Password = undefined;
        return this.generateToken(user);
      }
      else {
        console.log("User creation failed");
        const error = new Error("Insertion failed : ");
        error.isOperational = false;
        throw error;
      }
    } catch (err) {
      throw new DBError(err);
    }
  }
}
module.exports = CreateUserService;