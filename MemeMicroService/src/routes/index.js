const { Router } = require('express');
const route = Router();
const { upload, userPreferenceUpdater, categoryDeciderHelper, getTrendingMemes, uploadFile } = require('../controller');
const { checkToken } = require('../controller/token_validation');

//Upload meme and tags
route.post("/upload", upload);/*, categoryDeciderHelper, updatePreferences);*/
route.post("/upload2", userPreferenceUpdater); //Just for testing purpose
route.get("/getTrendingMemes",getTrendingMemes)
route.post("/uploadFile", uploadFile);


//TODO: change upload to uploadMeme

module.exports =  route;