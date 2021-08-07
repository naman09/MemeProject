const { Meme, db, MemeTag } = require('../models');

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
        if (typeof(memeObj.MemeTitle) != "string") {
            console.log("MemeTitle is not string");
            return false;
        }
        if (!memeObj.ActualData) { //TODO
            console.log("ActualData not present");
            return false;
        }
        if (!memeObj.TagList || memeObj.TagList.length == 0) {
            console.log("TagList not present");
            return false;
        }
        if (typeof(memeObj.TagList[0]) !== "string") {
            console.log("TagList items is not string");
            return false;
        }
        return true;
    }
    getTagRows(memeObj){
        return memeObj.TagList.map((tagName)=>{
            return `('${tagName}',1)` ;
        }).join();
    }
    getTagUpsertQuery(memeObj){
        const rows = this.getTagRows(memeObj);
        const queryString = `INSERT INTO Tags
        (TagName, MemeCount) VALUES ${rows}
        ON DUPLICATE KEY UPDATE MemeCount=MemeCount+1`;
        return queryString;
    }
    async executeDBQuery(queryString){
        return db.query(queryString);
    }
    getMemeTagValues(memeId, memeObj) {
        return memeObj.TagList.map((tagName) => {
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
            ActualData: memeObj.ActualData,
            MemeTitle: memeObj.MemeTitle,
            UploadedBy: memeObj.UploadedBy,
        }, { transaction: transaction });
    }
 
    //Upload Meme, Tag, MemeTag
    async upload(memeObj){
        console.log("Inside upload");
        if (!this.validate(memeObj)) {
            console.log("Invalid Meme Object");
            const error = new Error("Invalid Meme Object");
            error.isBadRequest = true;
            throw error;
        }
        const tagUpsertQuery = this.getTagUpsertQuery(memeObj);
        console.log(tagUpsertQuery);

        const currentTimestamp = String(Math.round(new Date().getTime()/1000));
        const memeId = memeObj.UploadedBy + currentTimestamp ;
        console.log("MemeId generated : " + memeId);
        const memeTagValues = this.getMemeTagValues(memeId, memeObj) ;
        console.log("Meme Tag Values", memeTagValues);

        const transaction = await db.transaction();
        try {
            const result = await Promise.all([
                this.uploadMeme(memeId, memeObj, transaction),
                this.executeDBQuery(tagUpsertQuery)
            ]);
            await this.uploadMemeTag(memeTagValues, transaction);
            await transaction.commit();
            console.log("Transaction committed");
            const meme = result[0].dataValues;
            console.log(meme);
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
            console.log("DB Error: " + err);
            const error = new Error("DB Error:" + err);
            if (String(err).search("Validation error") != -1) {
                error.isBadRequest = true;
            }
            error.isOperational = true;
            throw error;
        }
    }
}

module.exports = MemeUploader;