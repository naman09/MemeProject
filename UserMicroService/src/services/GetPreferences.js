const { UserMeme , UserCategory } = require('../models') 


class GetPreferences {
    constructor() {}

    // TODO Write one common function for validation 
    validateId(userId) {
        if (!userId) return false;
        if (typeof(userId) !== "string") return false;
        return true;
    }


    cmp(categoryA,categoryB) {
        const likenessA = categoryA.UserCategoryLikeness/categoryA.UserActivityCount;
        const likenessB = categoryB.UserCategoryLikeness/categoryB.UserActivityCount;
        console.log("A : ", likenessA, "B : ", likenessB);
        return likenessB - likenessA;
    }

    async getUserCategories(userId) {
        if (!this.validateId(userId)) {
            const error = new Error("Invalid user id");
            error.isBadRequest = true;
            throw error;
        }
        try{
        let categoryList = await UserCategory.findAll({
            where:{
                UserId:userId 
            }
        });
        categoryList = categoryList.map((category) => category.dataValues);
        categoryList.sort(this.cmp) ;
        const categoryIdList = categoryList.map((category) => category.CategoryId) ;
        return categoryList;
        } catch(err){
            console.log("DB Error: " + err);
            const error = new Error("DB Error: " + err);
            if (String(err).search("Validation error") != -1) {
                error.isBadRequest = true;
            }
            throw error;
        }
    }

     
     async getMemeLikeness(userId, memeId) {
        if (!this.validateId(userId) || !this.validateId(memeId)) {
            const error = new Error("Invalid UserId or MemeId");
            error.isBadRequest = true;
            throw error;
        }
        try {
            const meme = await UserMeme.findOne({
                where:{
                    UserId:userId,
                    MemeId:memeId
                }
            }); 
            if (!meme || !meme.dataValues) {
                const error = new Error("Invalid UserId or MemeId");
                error.isBadRequest = true;
                throw error;
            }
            return meme.dataValues.UserMemeLikeness ;
        } catch(err) {
            console.log("DB Error: " + err);
            const error = new Error("DB Error: " + err);
            if (String(err).search("Validation error") != -1) {
                error.isBadRequest = true;
            }
            throw error;
        }
    }

    //return list
     //TODO return only a few memes not all 
    async getFavMemes(userId) {
        if (!this.validateId(userId)) {
            const error = new Error("Invalid user id");
            error.isBadRequest = true;
            throw error;
        }
        try {
            const memeList = await UserMeme.findAll({
                where:{
                    UserId:userId,
                },
                order:[
                    ["LastUpdatedAt","ASC"],
                    ["UserMemeLikeness",'DESC']
                ]
            }) 
            const memeIdList = memeList.map((meme) => meme.dataValues.MemeId) ;
            return memeIdList ;
        } catch(err) {
            console.log("DB Error: " + err);
            const error = new Error("DB Error: " + err);
            if (String(err).search("Validation error") != -1) {
                error.isBadRequest = true;
            }
            throw error;
        }
    }
}

module.exports = GetPreferences;