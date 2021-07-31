const request = require('supertest');
const app = require("../../server");
const { db, UserMeme, UserCategory, User } = require('../../models');
const { Op } = require('sequelize') ;
const crypto = require("crypto");

describe('Update User preferences',()=>{
    beforeAll( async () => {
        await db.sync();
    });

    async function getUserMeme(preferenceObj) {
        let userMeme =await UserMeme.findOne({
            where: {
                UserId: preferenceObj.UserId,
                MemeId: preferenceObj.MemeId,
            }
        });
        return userMeme = userMeme.dataValues;
    }

    async function getUserCategory(preferenceObj) {
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

    it("should insert into both UserMeme and UserCategory", async () => {
        const randomIds = [1,2,3].map((i) => crypto.randomBytes(20).toString('hex'));
        const newPreferenceObj = {
            UserId: process.env.SAMPLE_USER_ID,
            MemeId: crypto.randomBytes(20).toString('hex'),
            NewMemeLikeness: 23,
            CategoryIdList: randomIds //This Ids should not exists for this userId
        }

        const res = await request(app)
        .put("/api/updatePreferences")
        .send(newPreferenceObj);
        
        const userMemeAfter = await getUserMeme(newPreferenceObj);
        const userCategoryAfter = await getUserCategory(newPreferenceObj);
        expect(userMemeAfter).not.toBeNull();
        expect(userCategoryAfter.length).not.toEqual(0);
    });

    it("should update both UserMeme and UserCategory", async () => {
        const preferenceObj = {
            UserId: process.env.SAMPLE_USER_ID,
            MemeId: process.env.SAMPLE_MEME_ID,
            NewMemeLikeness: 23,
            CategoryIdList: ["1","2","3"] //This ids should exists for this userId
        };

        const userMemeBefore =  await getUserMeme(preferenceObj);
        const userCategoryBefore =  await getUserCategory(preferenceObj);
        
        const res = await request(app)
        .put("/api/updatePreferences")
        .send(preferenceObj);
        
        const userMemeAfter = await getUserMeme(preferenceObj);
        const userCategoryAfter = await getUserCategory(preferenceObj);
        expect(res.statusCode).toEqual(200);
        expect(userMemeBefore.LastUpdatedAt).not.toEqual(userMemeAfter.LastUpdatedAt);
        expect(userMemeAfter.UserMemeLikeness).toEqual(preferenceObj.NewMemeLikeness);
        expect(userCategoryBefore.UserCategoryLikeness).toEqual(userCategoryAfter.UserCategoryLikeness - preferenceObj.NewMemeLikeness);
        expect(userCategoryBefore.UserActivityCount).toEqual(userCategoryAfter.UserActivityCount - 1);
    });
});