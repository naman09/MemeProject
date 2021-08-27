const { UserCategory, UserMeme,db } = require('../models');
const { Op, literal, INTEGER, query } = require('sequelize');

class UpdatePreference {
    constructor() {}

    validatePreferencesObject(preferencesObj){
        if (!preferencesObj) return false;
        if (typeof(preferencesObj.MemeId) !== "string") {
            con
            return false ;
        }
        if (typeof(preferencesObj.UserId) !== "string") return false ;
        if (typeof(preferencesObj.NewMemeLikeness) !== "number") return false ;
        if (!preferencesObj.CategoryIdList) return false ;
        if (!preferencesObj.CategoryIdList.length) return false ;
        if (typeof(preferencesObj.CategoryIdList[0]) !== "string") return false ;
        return true ;
    }
    
    async updateUserMeme(preferencesObj, transaction) {
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
            return `('${categoryId}',0,1,${preferencesObj.NewMemeLikeness},'${preferencesObj.UserId}')` ;
        }).join();
    }
    getUserCategoryUpsertQuery(preferencesObj) {
        const rows = this.getCategoryRows(preferencesObj);
        const queryString=`INSERT INTO UserCategories 
        (CategoryId, AccessCount, UserActivityCount, UserCategoryLikeness, UserId) 
        VALUES ${rows}
        ON DUPLICATE KEY UPDATE UserCategoryLikeness=UserCategoryLikeness + ${preferencesObj.NewMemeLikeness},
        UserActivityCount=UserActivityCount+1`;   
        return queryString ; 
    }

    async executeDBQuery(upsertQuery) {
        return db.query(upsertQuery);
    }

    async updateUserPreferences(preferencesObj) { 
        console.log("Inside updateUserPreferences");
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
                this.updateUserMeme(preferencesObj, transaction),
                this.executeDBQuery(userCategoryUpsertQuery)
            ]);
            await transaction.commit();
            console.log("Transaction committed");
            return 1;
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

module.exports = UpdatePreference;