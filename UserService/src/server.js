const express = require('express');
const { db } = require('./models');
const app = express();
PORT = 5555;

app.use('/health', (req,res) => {
    res.send("OK");
});

app.use('/api',require('./routes/api'));

db.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at port : ${PORT}`);
        });
    })
    .catch(err => { 
        console.log(err) 
    });
