const { Router } = require('express');
const route = Router();
const { upload, getTrendingMemes, likeMeme, getUserCategories, getRecommendedMemes } = require('../controller');
const { checkToken } = require('../controller/token_validation');

//Upload meme and tags
route.post("/upload", checkToken, upload);/*, categoryDeciderHelper, userPreferenceUpdater);*/
route.post("/getTrendingMemes", getTrendingMemes)
route.post("/likeMeme", checkToken, likeMeme);
route.post("/getRecommendedMemes", checkToken, getUserCategories, getRecommendedMemes)


//TODO: change upload to uploadMeme

module.exports = route;