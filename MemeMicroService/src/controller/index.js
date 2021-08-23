const { MemeUploaderService , FetchTrendingMemesService } = require('../services');
const memeUploaderServiceInstance = new MemeUploaderService();
const fetchTrendingMemesServiceInstance = new FetchTrendingMemesService();
const axios = require('axios');
const constants = require('../constants');
const fs = require('fs');

const uploadFile = async (req, res, next) => {
  console.log("Inside upload file");
  console.log("Requestfile" , req.body);
  const imageTmp = req.files.image;
  const imageData = imageTmp.data; 
  fs.writeFile(`./src/server/media/${imageTmp.name}`,imageData, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
  }});
  res.send("COOL");
}

/*
Stores media 
    generates media name, media path
    */

/*
    Input: MemeTitle, UploadedBy, TagString
    Output: MemeId --> This should be unique
*/
const upload = async (req, res, next) => {
  console.log("Inside uploadMeme");
  try {
    console.log(req.body);
    console.log(req.files.mediaFile);
    // console.log(req.files);
    const memeObj = req.body;
    const result = await memeUploaderServiceInstance.upload(memeObj, req.files.mediaFile);
    // if (memeId) {
    //     req.body.MemeId = memeId;
    //     next();
    // }
    res.status(200).send({
      data: result
    });
  } catch (err) {
    console.log("Error in upload");
    next(err);
  }
}

/*
    Input : MemeActualData + TagList
    Output : List of CategoryIds --> Put them in request object
*/
const categoryDeciderHelper = async (req, res, next) => { //TODO: need to test
  console.log("Inside categoryDeciderHelper");
  try {
    req.body.CategoryIdList = ["1", "2", "3"];
    const result = await memeUploaderServiceInstance.uploadMemeCategory(req.body.MemeId, req.body.CategoryIdList);
    if (result) {
      next();
    }
  } catch (err) {
    console.log("Error in categoryDeciderHelper");
    next(err);
  }
}

/*
    Input: UserId, MemeId, NewMemeLikeness, CategoryIdList
    Output: Success Message
*/
const updatePreferences = async (req, res, next) => {
  console.log("Inside updatePreferences");
  try {
    const baseUrl = 'http://localhost:5555';
    const result = await axios.put(baseUrl + '/api/updatePreferences', {
      UserId: req.body.UserId,
      MemeId: req.body.MemeId,
      NewMemeLikeness: constants.NEW_MEME_LIKENESS_DEFAULT,
      CategoryIdList: req.body.CategoryIdList
    });
    if (result) {
      console.log(result.data);
      res.status(200).send({
        data: {
          message: "Meme Uploaded Successfully",
          MemeId: req.body.MemeId
        }
      });
    } else { //TODO

    }
  } catch (err) {
    console.log("Error in updatePreferences");
    next(err);
  }
}

/*
    Input: pageNo, pageSize
    Ouput: List of memes = { MemeId, MemeTitle, ActualData }
*/
const fetchTrendingMemes = async (req, res, next) => {
  console.log("Inside fetchTrendingMemems");
  try {
    const memeList = await fetchTrendingMemesServiceInstance.fetchTrendingMemes(req.body.pageNo, req.body.pageSize);
    res.status(200).send({
      data: {
        TrendingMemeList: memeList
      }
    });
  } catch (err) {
    console.log("Error in fetchTrendingMemes");
    next(err);
  }
}

const fetchTrending = async (req, res, next) => {
  //check token
    //get user id by checking token
    //get memeList
    //call UserMicroService to get user likeness for each of these memes

  //just fetchtrenfingmemes
}

/*
  Input: UserId, pageNo, pageSize
  Output: List of memes
*/

/*
  UserCategories --> Categories converted to Memes --> UserMemes 
*/
const fetchRecommendedMemes = async (req, res, next) => {
  console.log("Inside fetchRecommendedMemes");
  try {

    const memeList = await fetchRecommendedMemesServiceInstance.fetchRecommendedMemes(req.body.userId, req.body.pageNo, req.body.pageSize);
    

  } catch (err) {
    console.log("Error in fetchRecommendedMemes");
    next(err);
  }
}

/*TODO:
MemeUploader
CategoryDeciderHelper
UserPreferencesUpdater(??) 
FetchTrendingMemes

MemeUpdater
FetchRecommendedMemes
*/

module.exports = {
  upload,
  updatePreferences,
  categoryDeciderHelper,
  fetchTrendingMemes,
  uploadFile //just for testing
};