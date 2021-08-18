const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use('/health', (req,res) => {
    console.log("Inside health");
    res.send("UserMicroService working fine :)");
});

app.use('/api',require('../routes'));

//TODO : How to it better
app.use((err, req, res, next) => {
    console.log("Error in error handler middleware : " + err);
    if (err.isBadRequest) {
        return res.status(400).send({
            code: 400,
            message: err.message,
            errors: err.errors
        });
    }

    if (err.isUnauthorized) { //User will be redirected to login page
        return res.status(400).send({
            code: 401,
            message: err.message,
            errors: err.errors
        });
    }

    res.status(500).send({
        error: {
            code: 500,
            message: err.message,
            errors: err.errors
        }
    });
});

process.on("uncaughtException", err => {
    // errorHandler.handleError(error);
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
});

module.exports = app;