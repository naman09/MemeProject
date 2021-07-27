const request = require('supertest');
const app = require("../../server");
const { db, UserMeme, UserCategory } = require('../../models');
const { Op } = require('sequelize') ;

describe('Update User preferences',()=>{
    beforeAll( async () => {
        await db.sync();
    });
    xit("should authenticate",async ()=>{

    });
    fit("should update both UserMeme and UserCategory", async () => {
        const preferenceObj = {
            UserId: "OM",
            MemeId: "123",
            NewMemeLikeness: 23,
            CategoryIdList: ["1","2","3"]
        };
        async function getUserMeme() {
            let userMeme = await UserMeme.findOne({
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
});