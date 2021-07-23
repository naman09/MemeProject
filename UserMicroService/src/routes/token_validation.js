const { verify } = require('jsonwebtoken');

module.exports = {
    checkToken: (req, res, next) => {
        const token = req.get("authorization");
        if (token) {
            token = token.slice(7);//bearer <token>
            verify(token, "qwe1234", (err, decoded) => { //TODO write secret Key correctly
                if (err) {
                    res.json({
                        success: 0,
                        message: "Invalid token"
                    });

                } else {
                    next();
                }
            });
        } else {
            res.json({
                success: 0,
                message: "Access Denied! Unauthoirized user"
            });
        }
    }
}