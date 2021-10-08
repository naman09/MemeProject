const { verify } = require('jsonwebtoken');
require('dotenv').config();

const checkToken = (req, res, next) => {
    let token = req.get('Authorization');
    if (!token) {
        const error = new Error("Token Error: Token not present in auth header");
        error.isUnauthorized = true;
        throw error;
    }
    console.log(token);
    token = token.slice(7);//bearer <token>
    console.log(token);
    verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => { //TODO write secret Key correctly
        if (err) {
            const error = new Error("Token Error: " + err);
            error.isUnauthorized = true;
            throw error;

        } else {
            console.log("Token valid");
            next();
        }
    });
}

module.exports = {
    checkToken
};