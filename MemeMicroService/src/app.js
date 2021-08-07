const server = require("./server");
const { db } = require('./models');
require('dotenv').config();

const PORT = process.env.SERVER_PORT;

db.sync()
.then(() => {
    server.listen(PORT, () => {
        console.log(`Server running at port : ${PORT}`);
    });
})
.catch(err => { 
    console.log(err); 
    console.log("SERVER STARTUP ERROR : " + err);
});
