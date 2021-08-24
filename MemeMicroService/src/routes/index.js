const { Router } = require('express');
const route = Router();
const {upload,updatePreferences, categoryDeciderHelper,fetchTrendingMemes, uploadFile } = require('../controller');
const { checkToken } = require('../controller/token_validation');

//Upload meme and tags
route.post("/upload", upload);/*, categoryDeciderHelper, updatePreferences);*/
route.post("/upload2", updatePreferences); //Just for testing purpose
route.get("/fetchTrendingMemes",fetchTrendingMemes)
route.post("/uploadFile", uploadFile);


module.exports =  route;