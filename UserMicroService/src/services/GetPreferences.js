const { UserMeme, UserCategory } = require('../models')
const { Op } = require('sequelize');
const { DBError, InputError } = require('../errors')

class GetPreferences {
    constructor() { }

    //TODO write proper validation function to know which field created problem
    validateId(id) {
        if (!id) {
            console.log("Id undefined");
            return false;
        }
        if (typeof (id) !== "string") {
            console.log("Id datatype expected string but found " + typeof (id));
            return false;
        }
        return true;
    }
    validateIdList(idList) {
        console.log("Validating list");
        if (!idList) {
            console.log("IdList undefined");
            return false;
        }
        for (let i = 0; i < idList.length; i++) {
            if (!this.validateId(idList[i])) {
                return false;
            }
        }
        return true;
    }



    cmp(categoryA, categoryB) {
        const likenessA = categoryA.UserCategoryLikeness / categoryA.UserActivityCount;
        const likenessB = categoryB.UserCategoryLikeness / categoryB.UserActivityCount;
        console.log("A : ", likenessA, "B : ", likenessB);
        return likenessB - likenessA;
    }

    async getUserCategories(userId) {
        if (!this.validateId(userId)) {
            const error = new Error("Invalid user id");
            error.isBadReqlikenessAuest = true;
            throw error;
        }
        try {
            let categoryList = await UserCategory.findAll({
                where: {
                    UserId: userId
                }
            });
            categoryList = categoryList.map((category) => category.dataValues);
            categoryList.sort(this.cmp);
            const categoryIdList = categoryList.map((category) => category.CategoryId);
            return categoryList;
        } catch (err) {
            console.log("DB Error: " + err);
            const error = new Error("DB Error: " + err);
            if (String(err).search("Validation error") != -1) {
                error.isBadRequest = true;
            }
            throw error;
        }
    }


    async getMemeLikeness(userId, memeIdList) {
        if (!this.validateId(userId) || !this.validateIdList(memeIdList)) {
            throw new InputError("Invalid UserId or MemeIdList");
        }
        try {
            let memeList = await UserMeme.findAll({
                where: {
                    UserId: userId,
                    MemeId: {
                        [Op.in]: memeIdList
                    }
                }
            });

            const memeIdLikenessList = memeList.map(meme => ({
                MemeId: meme.dataValues.MemeId,
                UserMemeLikeness: meme.dataValues.UserMemeLikeness
            }));
            return memeIdLikenessList; //return empty list 
        } catch (err) {
            throw new DBError(err);
        }
    }

    //return list
    //TODO return only a few memes not all 
    async getFavMemes(userId) {
        console.log("Inside getFavMemes SVC");
        if (!this.validateId(userId)) {
            throw new InputError("Invalid UserId");
        }
        try {
            const memeList = await UserMeme.findAll({
                where: {
                    UserId: userId,
                },
                order: [
                    ["LastUpdatedAt", "ASC"],
                    ["UserMemeLikeness", 'DESC']
                ]
            });
            const memeIdList = memeList.map((meme) => meme.dataValues.MemeId);
            return memeIdList;
        } catch (err) {
            throw new DBError(err);
        }
    }
}

module.exports = GetPreferences;