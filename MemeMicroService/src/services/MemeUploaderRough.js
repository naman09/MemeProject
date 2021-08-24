const { Meme, db, MemeTag } = require('../models');
const { InputError, DBError } = require('../errors');
const { MEDIA_BASE_URL,  } = require('../constants');
const fs = require('fs/promises');
const { existsSync } = require('fs'); //Could be optimized

class MemeUploader{
  constructor(){}

  validate(memeObj) {
    console.log("Validating memeObj");
    if (!memeObj) {
        console.log("Meme Object not present");
        return false;
    }
    if (typeof(memeObj.UploadedBy) !== "string") { //TODO: No need to check for undefined
        console.log("UploadedBy is not string");
        return false;
    }
    if (typeof(memeObj.MemeTitle) !== "string") {
        console.log("MemeTitle is not string");
        return false;
    }
    if (typeof(memeObj.TagString) !== "string") {
        console.log("TagString is not string");
        return false;
    }
    return true;
  }
  getTagRows(tagList){
    return tagList.map((tagName)=>{
        return `('${tagName}',1)` ;
    }).join();
  }
  getTagUpsertQuery(tagList){
    const rows = this.getTagRows(tagList);
    const queryString = `INSERT INTO Tags
    (TagName, MemeCount) VALUES ${rows}
    ON DUPLICATE KEY UPDATE MemeCount=MemeCount+1`;
    return queryString;
  }
  async executeDBQuery(queryString){
    return db.query(queryString);
  }
  getMemeTagValues(memeId, tagList) {
    return tagList.map((tagName) => {
        return { MemeId: memeId, TagName: tagName} 
    });
  }
  getMemeCategoryValues(memeId, categoryIdList) {
    return categoryIdList.map((categoryId) => {
        return { MemeId: memeId, CategoryId: categoryId }
    });
  }
  async uploadMemeTag(values, transaction){
    return MemeTag.bulkCreate(values, { transaction: transaction }) ;
  }
  async uploadMemeCategory(memeId, categoryIdList){
    const values = this.getMemeCategoryValues(memeId, categoryIdList);
    try {
        const result = await MemeCategory.bulkCreate(values);
        return 1;
    } catch (err) {
        console.log("DB Error: " + err);
        const error = new Error("DB Error:" + err);
        if (String(err).search("Validation error") != -1) {
            error.isBadRequest = true;
        }
        error.isOperational = true;
        throw error;
    }
  }

  async uploadMeme(memeId, memeObj,transaction) {
    return Meme.create({
        MemeId: memeId,
        MediaPath: memeObj.MediaPath,
        MediaName: memeObj.MediaName,
        MemeTitle: memeObj.MemeTitle,
        UploadedBy: memeObj.UploadedBy,
    }, { transaction: transaction });
  }

  async storeMedia(media,mediaPath) { //can be image or video
    console.log("Storing media");
    const mediaData = media.data; 
    try {
      await fs.writeFile(mediaPath, mediaData);
      console.log("File written successfully\n");
    } catch(err) {
      console.log(err);
        throw new Error("Media could not be saved");
    }
    return media.name;
  }

  getTagList(tagString) {
    return tagString.split(",").map((tag) => tag.trim());
  };

  constructMemeObj(memeObj,media){
    
  }

  //Upload Meme, Tag, MemeTag
  async upload(memeObj, media){
    console.log("Inside upload");
    if (!this.validate(memeObj)) {
        throw new InputError("Invalid Meme Object");
    }

    memeObj.TagList = this.getTagList(memeObj.TagString);
    const tagUpsertQuery = this.getTagUpsertQuery(memeObj.TagList);
    console.log(tagUpsertQuery);

    const currentTimestamp = String(Math.round(new Date().getTime()/1000));
    const memeId = memeObj.UploadedBy + currentTimestamp ; //UserId + TIMESTAMP
    memeObj.MediaName = media.name;
    memeObj.MediaPath = MEDIA_BASE_URL + memeId + media.name;
    console.log("MemeId generated : " + memeId);
    const memeTagValues = this.getMemeTagValues(memeId, memeObj.TagList) ;
    console.log("Meme Tag Values", memeTagValues);

    const transaction = await db.transaction();
    try {
        const result = await Promise.all([
            this.uploadMeme(memeId, memeObj, transaction),
            this.executeDBQuery(tagUpsertQuery),
            this.storeMedia(media, memeObj.MediaPath)
        ]);
        await this.uploadMemeTag(memeTagValues, transaction);
        await transaction.commit();
        console.log("Transaction committed");
        
        const meme = result[0].dataValues;
        // console.log(meme);
        if (meme) {
            console.log("Meme uploaded successfully");
            return meme.MemeId;
        } else {
            console.log("Meme upload failed");
            const error = new Error("Upload failed");
            error.isOperational = false;
            throw error;
        }
    } catch (err) {
        await transaction.rollback();
        if (existsSync(memeObj.MediaPath)) {
          console.log("This file will be deleted : ", memeObj.MediaPath);
          fs.unlink(memeObj.MediaPath); //Need to check this code  (checked)
        }
        throw new DBError(err);
    }
  }
}

module.exports = MemeUploader;