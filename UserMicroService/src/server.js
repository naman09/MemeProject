const express = require('express');
const { db } = require('./models');
const app = express();
require('dotenv').config();

PORT = process.env.SERVER_PORT;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use('/health', (req,res) => {
    res.send("OK");
});

app.use('/api',require('./routes'));

db.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at port : ${PORT}`);
        });
    })
    .catch(err => { 
        console.log(err) 
    });
