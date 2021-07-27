const { UserCategory, UserMeme,db } = require('../models');
const { Op, literal } = require('sequelize');

class UpdatePreferenceService {
    constructor() {}
    
    async updateUserMeme(preferencesObj, transaction) {
        return UserMeme.update({
            UserMemeLikeness: preferencesObj.NewMemeLikeness,
        },{
            where: {
                MemeId: preferencesObj.MemeId,
                UserId: preferencesObj.UserId
            }
        }, { transaction: transaction });
    }

    async updateUserCategory(preferencesObj, transaction) {
        return UserCategory.update({
            UserCategoryLikeness: literal(`UserCategoryLikeness + ${preferencesObj.NewMemeLikeness}`),
            UserActivityCount: literal(`UserActivityCount + 1`)
        },{
            where: {
                CategoryId: {
                    [Op.in] : preferencesObj.CategoryIdList
                },
                UserId: preferencesObj.UserId
            }
        }, { transaction: transaction });
    }

    async updateUserPreferences(preferencesObj) { 
        const transaction = await db.transaction();
        try { 
            await Promise.all([
                this.updateUserMeme(preferencesObj,transaction),
                this.updateUserCategory(preferencesObj, transaction)
            ]);
            await transaction.commit();
            console.log("Transaction committed");
            return 1;
        } catch (err) {
            console.log("DB Error: " + err);
            await transaction.rollback();
            const error = new Error("DB Error: " + err);
            error.isOperational = true;
            throw error;
        }
    }
}

module.exports = UpdatePreferenceService;