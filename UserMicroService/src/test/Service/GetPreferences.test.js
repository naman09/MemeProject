const GetPreferencesService = require("../../services/GetPreferences");
const { db } = require("../../models");

const getPreferencesServiceInstance = new GetPreferencesService() ;
describe("get user categories", ()=>{
        beforeAll( async () => {
            await db.sync() ;
        });

        const userId = "43f75d5470b258bba1ba1e7a0c1eb734289a50cc" ;
        xit("should get user categories",async()=>{
            const categoryList = await getPreferencesServiceInstance.getUserCategories(userId) ;
            expect(categoryList).not.toBeNull() ;
        })
})


describe("Get user memes", () => {
    beforeAll(async () => {
        await db.sync();       
    });
    const userId = "43f75d5470b258bba1ba1e7a0c1eb734289a50cc";
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
    const userId = "43f75d5470b258bba1ba1e7a0c1eb734289a50cc";
    const memeId = "123"
    xit("should get meme likeness for given UserId and MemeId", async () => {
      const memeLikeness = await getPreferencesServiceInstance.getMemeLikeness(userId,memeId);
      console.log(memeLikeness);
      expect(memeLikeness).toEqual(13);     
    });


    xit("should validate Userid and MemeId", async () => {
        try {
            const memeLikeness = await getPreferencesServiceInstance.getMemeLikeness(userId,123);
            console.log(memeLikeness);
            expect(true).toEqual(false);
        } catch(e) {
            console.log(e);
            expect(e.message).toEqual(expect.stringContaining("Invalid UserId or MemeId"));
        }
             
    });

});