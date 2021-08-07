const MemeUploaderService = require("../services/MemeUploader");
const memeUploaderServiceInstance = new MemeUploaderService();
const axios = require('axios');
const constants = require('../constants');

/*
    Input: MemeTitle, ActualData, UploadedBy, TagList
    Output: MemeId --> This should be unique
*/
const upload = async(req, res, next) => {
    console.log("Inside uploadMeme");
    try {
        const memeId = await memeUploaderServiceInstance.upload(req.body);
        // if (memeId) {
        //     req.body.MemeId = memeId;
        //     next();
        // }
        res.status(200).send({
            data: {
                message: "Work in progress"
            }
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
const categoryDeciderHelper = async(req, res, next) => { //TODO: need to test
    console.log("Inside categoryDeciderHelper");
    try {
        req.body.CategoryIdList=["1","2","3"] ;
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
const updatePreferences = async(req, res, next) => {
    console.log("Inside updatePreferences");
    try{
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

/*TODO:
MemeUploader
CategoryDeciderHelper
UserPreferencesUpdater(??) 

FetchRecentMemes
MemeUpdater
FetchRecommendedMemes
*/

module.exports = {
    upload,
    updatePreferences,
    categoryDeciderHelper
};