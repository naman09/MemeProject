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