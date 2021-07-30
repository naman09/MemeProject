const request = require('supertest');
const app = require("../../server");
const { db, UserMeme, UserCategory } = require('../../models');
const { Op } = require('sequelize') ;

describe('Update User preferences',()=>{
    beforeAll( async () => {
        await db.sync();
    });

    //const existingUserId = getExistingUserId();
    //const existingMemeId

    function getExistingUserId() {
        const user = User.findOne();
        if (!user) return null;
        return user.dataValues.UserId ;
    }


    xit("should authenticate",async ()=>{

    });
    xit("should update both UserMeme and UserCategory", async () => {

        const existingUserId = getExistingUserId();
        expect(existingUserId).not.toBeNull();

        const preferenceObj = {
            UserId: existingUserId,
            MemeId: "123",
            NewMemeLikeness: 100,
            CategoryIdList: ["1","2","3"] //These IDs should exists for this userId
        };
        async function getUserMeme() {
            let userMeme =await UserMeme.findOne({
                where: {
                    UserId: preferenceObj.UserId,
                    MemeId: preferenceObj.MemeId,
                }
            });
            return userMeme = userMeme.dataValues;
        }

        async function getUserCategory() {
            let userCategory = await UserCategory.findAll({
                where: {
                    UserId: preferenceObj.UserId,
                    CategoryId: {
                        [Op.in] : preferenceObj.CategoryIdList
                    }
                }
            });
            return  userCategory = userCategory[0].dataValues ;
        }

        const userMemeBefore =  await getUserMeme();
        const userCategoryBefore =  await getUserCategory();
        
        const res = await request(app)
        .put("/api/updatePreferences")
        .send(preferenceObj);
        
        const userMemeAfter = await getUserMeme();
        const userCategoryAfter = await getUserCategory();

        expect(res.statusCode).toEqual(200);
        expect(userMemeBefore.LastUpdatedAt).not.toEqual(userMemeAfter.LastUpdatedAt);
        expect(userMemeAfter.UserMemeLikeness).toEqual(preferenceObj.NewMemeLikeness);
        expect(userCategoryBefore.UserCategoryLikeness).toEqual(userCategoryAfter.UserCategoryLikeness - preferenceObj.NewMemeLikeness);
        expect(userCategoryBefore.UserActivityCount).toEqual(userCategoryAfter.UserActivityCount - 1);
    });
    xit("should insert into both UserMeme and UserCategory", async () => {

        const existingUserId = getExistingUserId();
        expect(existingUserId).not.toBeNull();

        const preferenceObj = {
            UserId: existingUserId,
            MemeId: "456",
            NewMemeLikeness: 23,
            CategoryIdList: ["6","7","8"] //This Ids should not exists for this userId
        };
        async function getUserMeme() {
            let userMeme = await UserMeme.findOne({
                where: {
                    UserId: preferenceObj.UserId,
                    MemeId: preferenceObj.MemeId,
                }
            });
            return userMeme;
        }

        async function getUserCategory() {
            let userCategory = await UserCategory.findAll({
                where: {
                    UserId: preferenceObj.UserId,
                    CategoryId: {
                        [Op.in] : preferenceObj.CategoryIdList
                    }
                }
            });
            return  userCategory; 
        }
        
        const res = await request(app)
        .put("/api/updatePreferences")
        .send(preferenceObj);
        
        const userMemeAfter = await getUserMeme();
        const userCategoryAfter = await getUserCategory();

        expect(userMemeAfter).not.toBeNull();
        expect(userCategoryAfter.length).not.toEqual(0);
    });
});