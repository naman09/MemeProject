const { Router } = require('express');
const route = Router();
const { upload, getTrendingMemes, likeMeme } = require('../controller');
const { checkToken } = require('../controller/token_validation');

//Upload meme and tags
route.post("/upload", checkToken, upload);/*, categoryDeciderHelper, userPreferenceUpdater);*/
route.get("/getTrendingMemes", getTrendingMemes)
route.post("/likeMeme", checkToken, likeMeme);


//TODO: change upload to uploadMeme

module.exports = route;