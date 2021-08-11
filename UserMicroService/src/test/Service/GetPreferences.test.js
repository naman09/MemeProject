const GetPreferencesService = require("../../services/GetPreferences");
const { db, UserMeme } = require("../../models");
require('dotenv').config();

const getPreferencesServiceInstance = new GetPreferencesService() ;
describe("get user categories", ()=>{
        beforeAll( async () => {
            await db.sync() ;
        });
        const userId = process.env.SAMPLE_USER_ID ;
        xit("should get user categories",async()=>{
            const categoryList = await getPreferencesServiceInstance.getUserCategories(userId) ;
            expect(categoryList).not.toBeNull() ;
        })
})

describe("Get user memes", () => {
    beforeAll(async () => {
        await db.sync();       
    });
    const userId = process.env.SAMPLE_USER_ID;
    xit("should get all meme ids for given user id", async () => {
      const favMemes = await getPreferencesServiceInstance.getFavMemes(userId);
      console.log(favMemes);
      expect(favMemes).not.toBeNull();     
    });

});

describe("Get Meme likeness", () => {
    beforeAll(async () => {
        await db.sync();       
    });
    const userId = process.env.SAMPLE_USER_ID;
    const memeId = process.env.SAMPLE_MEME_ID;
    xit("should get meme likeness for given UserId and MemeId", async () => {
      const memeLikeness = await getPreferencesServiceInstance.getMemeLikeness(userId, memeId);
      const meme = await UserMeme.findOne({
          where: {
            UserId: userId,
            MemeId: memeId
          }
      });
      const memeLikenessExpected = meme.dataValues.UserMemeLikeness;
      expect(memeLikeness).toEqual(memeLikenessExpected);     
    });

    xit("should validate Userid and MemeId", async () => {
        try {
            const memeLikeness = await getPreferencesServiceInstance.getMemeLikeness(userId,123);
            expect(true).toEqual(false);
        } catch(e) {
            console.log(e);
            expect(e.message).toEqual(expect.stringContaining("Invalid UserId or MemeId"));
        }
             
    });

});