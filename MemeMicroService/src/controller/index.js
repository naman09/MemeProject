const { MemeUploaderSVC , FetchTrendingMemesSVC, LikeUpdaterSVC } = require('../services');
const memeUploaderSVC = new MemeUploaderSVC();
const fetchTrendingMemesSVC = new FetchTrendingMemesSVC();
const likeUpdaterSVC = new LikeUpdaterSVC();
const axios = require('axios');
const constants = require('../constants');
const fs = require('fs');

/*
  Input:  memeId, deltaMemeLikeness, deltaActivityCount
*/

const likeUpdater = async(req, res, next) => {
  console.log("Inside likeUpdater controller");
  try {
    await likeUpdaterSVC.update(req.body);
    res.status(200).send({
      data: {
        message: "Success"
      }
    });
  } catch (err) {
    console.log("Error in likeUpdater controller");
    next(err);
  }
}

//TODO : SVC to convert a MemeId to CategoryIdList

const uploadFile = async (req, res, next) => {
  console.log("Inside uploadFile controller");
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
//TODO : update Category Activity , MemeCategory
const upload = async (req, res, next) => {
  console.log("Inside upload controller");
  try {
    console.log(req.body);
    console.log(req.files.mediaFile);
    // console.log(req.files);
    const memeObj = req.body;
    const result = await memeUploaderSVC.upload(memeObj, req.files.mediaFile);
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

//upload, categoryDeciderHelper (In turn calls Category_MS), updatePreferences 

/*
    Input : MemeActualData + TagList
    Output : List of CategoryIds --> Put them in request object
*/
const categoryDeciderHelper = async (req, res, next) => { //TODO: need to test
  console.log("Inside categoryDeciderHelper controller");
  try {
    // Call CategoryMicroService to get CategoryIdList of a particular Meme 
    req.body.CategoryIdList = ["1", "2", "3"];
    const result = await memeUploaderSVC.upload(req.body.MemeId, req.body.CategoryIdList);
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
  console.log("Inside updateUserPreferences controller");
  try {
    const baseUrl = 'http://localhost:5555';
    const result = await axios.put(baseUrl + '/api/updateUserPreferences', {
      UserId: req.body.UserId,
      MemeId: req.body.MemeId,
      NewMemeLikeness: constants.NEW_MEME_LIKENESS_DEFAULT, //User will like the meme which he uploads
      CategoryIdList: req.body.CategoryIdList
    });
    if (result) {
      console.log(result.data);
      res.status(200).send({
        data: {
          message: "Meme Uploaded Successfully",
          MemeId: req.body.MemeId, 
          MediaPath: req.body.MediaPath 
        }
      });
    } else { //TODO

    }
  } catch (err) {
    console.log("Error in updatePreferences controller");
    next(err);
  }
}

/*
    Input: pageNo, pageSize
    Ouput: List of memes = { MemeId, MemeTitle, ActualData }
*/
const fetchTrendingMemes = async (req, res, next) => {
  console.log("Inside fetchTrendingMemems controller");
  try {
    const memeList = await fetchTrendingMemesSVC.fetchTrendingMemes(req.body.pageNo, req.body.pageSize);
    res.status(200).send({
      data: {
        TrendingMemeList: memeList
      }
    });
  } catch (err) {
    console.log("Error in fetchTrendingMemes controller");
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
  console.log("Inside fetchRecommendedMemes controller");
  try {

    const memeList = await fetchRecommendedMemesServiceInstance.fetchRecommendedMemes(req.body.userId, req.body.pageNo, req.body.pageSize);
    

  } catch (err) {
    console.log("Error in fetchRecommendedMemes controller");
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
  uploadFile, //just for testing
  likeUpdater
};