const { verify } = require('jsonwebtoken');
require('dotenv').config() ;

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7);//bearer <token>
            verify(token, process.env.SECRET_KEY, (err, decoded) => { //TODO write secret Key correctly
                if (err) {
                    const error = new Error("Token Error: " + err);
                    error.isUnauthorized = true;
                    throw error;

                } else {
                    console.log("Token valid");
                    next();
                }
            });
        } else {
                const error = new Error("Token Error: Token not present in auth header");
                error.isUnauthorized = true;
                throw error;
        }
    }
}