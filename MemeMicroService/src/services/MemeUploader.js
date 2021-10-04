const { Meme, db, MemeTag, MemeCategory } = require('../models');
const { InputError, DBError } = require('../errors');
const { MEDIA_BASE_URL, NEW_MEME_LIKENESS_DEFAULT } = require('../constants');
const fs = require('fs/promises');
const { existsSync } = require('fs'); //Could be optimized

// TODO Update CategoryActivity
class MemeUploader {
  constructor() { }

  validate(memeObj) {
    console.log("Validating memeObj");
    if (!memeObj) {
      console.log("Meme Object not present");
      return false;
    }
    if (typeof (memeObj.UploadedBy) !== "string") { //TODO: No need to check for undefined
      console.log("UploadedBy expected string found " + typeof (memeObj.UploadedBy));
      return false;
    }
    if (typeof (memeObj.MemeTitle) !== "string") {
      console.log("MemeTitle expected string found " + typeof (memeObj.MemeTitle));
      return false;
    }
    if (typeof (memeObj.TagString) !== "string") {
      console.log("TagString expected string found " + typeof (memeObj.TagString));
      return false;
    }
    return true;
  }

  getTagUpsertQuery(tagList) {
    const rows = tagList.map((tagName) => {
      return `('${tagName}',1)`;
    }).join();
    const queryString = `INSERT INTO Tags
    (TagName, MemeCount) VALUES ${rows}
    ON DUPLICATE KEY UPDATE MemeCount=MemeCount+1`;
    console.log("RAW QUERY : " + queryString);
    return queryString;
  }

  async uploadMemeTag(values, transaction) {
    return MemeTag.bulkCreate(values, { transaction: transaction });
  }

  async uploadMeme(memeObj, transaction) {
    console.log("Storing meme in DB");
    return Meme.create({
      MemeId: memeObj.MemeId,
      MediaPath: memeObj.MediaPath,
      OriginalMediaName: memeObj.OriginalMediaName,
      MemeTitle: memeObj.MemeTitle,
      UploadedBy: memeObj.UploadedBy,
      MediaType: memeObj.MediaType,
      TotalMemeLikeness: NEW_MEME_LIKENESS_DEFAULT
    }, { transaction: transaction });
  }

  async storeMedia(media, mediaPath) { //can be image or video
    console.log("Storing media");
    const mediaData = media.data;
    try {
      await fs.writeFile(MEDIA_BASE_URL + mediaPath, mediaData); //No need of await
      console.log("File written successfully\n");
    } catch (err) {
      console.log(err);
      throw new Error("Media could not be saved");
    }
    return media.name;
  }

  constructMemeObj(memeObj, media) {
    memeObj.TagList = memeObj.TagString.split(",").map((tag) => tag.trim());
    const currentTimestamp = String(Math.round(new Date().getTime() / 1000));
    const memeId = memeObj.UploadedBy + currentTimestamp; //UserId + TIMESTAMP
    memeObj.OriginalMediaName = media.name;
    memeObj.MediaPath = memeId + media.name; //TODO: REmove in future
    memeObj.MemeId = memeId;
    console.log("MemeId generated : " + memeId);
  }

  //Upload Meme, Tag, MemeTag
  async upload(memeObj, media) {
    console.log("Inside upload(MEME) SVC");
    if (!this.validate(memeObj)) {
      throw new InputError("Invalid Meme Object");
    }
    this.constructMemeObj(memeObj, media);
    const tagUpsertQuery = this.getTagUpsertQuery(memeObj.TagList);
    const memeTagValues = memeObj.TagList.map((tagName) => {
      return { MemeId: memeObj.MemeId, TagName: tagName }
    });
    console.log("Meme Tag Values", memeTagValues);

    const transaction = await db.transaction();
    try {
      console.log("Transaction started");
      const result = await Promise.all([
        this.uploadMeme(memeObj, transaction),
        db.query(tagUpsertQuery),
        this.storeMedia(media, memeObj.MediaPath)
      ]);
      console.log("Upload meme and tag sucessful!");
      await this.uploadMemeTag(memeTagValues, transaction);
      console.log("Upload memeTag successful!");
      await transaction.commit();
      console.log("Transaction committed");
      const meme = result[0].dataValues;
      console.log(meme);
      if (meme) {
        console.log("Meme uploaded successfully");
        return { MemeId: meme.MemeId, MediaPath: meme.MediaPath };
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