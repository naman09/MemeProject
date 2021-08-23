const express = require('express');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');

// for parsing multipart/form-data
app.use(fileUpload()); //for media upload through form data

app.use(cors());

//serve static resources as urls
app.use('/media', express.static(__dirname + '/media/'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json({limit: '50mb'})); 

app.use('/health', (req, res) => {
  console.log("Inside MemeMicroService health");
  res.send("MemeMicroService running fine :)");
});

app.use('/api',require('../routes'));

//TODO : How to do it better
app.use((err, req, res, next) => {
  console.log("Error catched in error handler middleware : " + err);
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

process.on("uncaughtException", (err) => {
    // errorHandler.handleError(error);
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
});

module.exports = app;