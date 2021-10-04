const { UserCategory, UserMeme, db } = require('../models');
const { Op, literal, INTEGER, query } = require('sequelize');

class userPreferenceUpdater {
    constructor() { }

    validatePreferencesObject(preferencesObj) {
        if (!preferencesObj) return false;
        if (typeof (preferencesObj.MemeId) !== "string") {
            console.log("MemeId expected string found " + typeof (preferencesObj.MemeId));
            return false;
        }
        if (typeof (preferencesObj.UserId) !== "string") {
            console.log("UserId expected string found " + typeof (preferencesObj.UserId));
            return false;
        }
        if (typeof (preferencesObj.NewMemeLikeness) !== "number") {
            console.log("NewMemeLikeness expected number found " + typeof (preferencesObj.NewMemeLikeness));
            return false;
        }
        if (!preferencesObj.CategoryIdList) {
            console.log("CategoryIdList can not be undefined");
            return false;
        }
        if (!preferencesObj.CategoryIdList.length) {
            console.log("CategoryIdList expected non empty");
            return false;
        }
        if (typeof (preferencesObj.CategoryIdList[0]) !== "string") {
            console.log("CategoryId expected string found " + typeof (preferencesObj.CategoryIdList[0]));
            return false;
        }
        return true;
    }

    async upsertUserMeme(preferencesObj, transaction) {
        const date = new Date();
        return UserMeme.upsert({
            MemeId: preferencesObj.MemeId,
            UserId: preferencesObj.UserId,
            UserMemeLikeness: preferencesObj.NewMemeLikeness,
            LastUpdatedAt: date.toISOString()
        }, { transaction: transaction });
    }

    getCategoryRows(preferencesObj) {
        return preferencesObj.CategoryIdList.map((categoryId) => {
            return `('${categoryId}',0,1,${preferencesObj.NewMemeLikeness},'${preferencesObj.UserId}')`;
        }).join();
    }
    getUserCategoryUpsertQuery(preferencesObj) {
        const rows = this.getCategoryRows(preferencesObj);
        const queryString = `INSERT INTO UserCategories 
        (CategoryId, AccessCount, UserActivityCount, UserCategoryLikeness, UserId) 
        VALUES ${rows}
        ON DUPLICATE KEY UPDATE UserCategoryLikeness=UserCategoryLikeness + ${preferencesObj.NewMemeLikeness},
        UserActivityCount=UserActivityCount+1`;
        return queryString;
    }

    async executeDBQuery(upsertQuery) {
        return db.query(upsertQuery);
    }

    async userPreferenceUpdater(preferencesObj) {
        console.log("Inside userPreferenceUpdater SVC");
        if (!this.validatePreferencesObject(preferencesObj)) {
            console.log("Invalid preferences object");
            const error = new Error("Error in preference object");
            error.isBadRequest = true;
            throw error;
        }
        const userCategoryUpsertQuery = this.getUserCategoryUpsertQuery(preferencesObj);
        const transaction = await db.transaction();
        try {
            await Promise.all([
                this.upsertUserMeme(preferencesObj, transaction),
                this.executeDBQuery(userCategoryUpsertQuery)
            ]);
            await transaction.commit();
            console.log("Transaction committed");
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

module.exports = userPreferenceUpdater;