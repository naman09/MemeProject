const { UserMeme , UserCategory } = require('../models') 


class GetPreferences {
    constructor() {}

    // TODO Write one common function for validatoon 
    validateUserId(userId) {
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
        if (!this.validateUserId(userId)) {
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

     //return list
     //TODO return only a few memes not all 
     async getFavMemes(userId) {
        if (!this.validateUserId(userId)) {
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