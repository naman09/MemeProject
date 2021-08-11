const UpdatePreferenceService = require("../../services/UpdatePreference");
const { db } = require("../../models")
require('dotenv').config();

describe("Update Preferences Bad Requests", () => {
    beforeAll(async ()=>{
        await db.sync();
    });

    const updatePreferenceServiceInstance = new UpdatePreferenceService() ;

    function getExistingUserId() {
        const user = User.findOne();
        if (!user) return null;
        return user.dataValues.UserId ;
    }

    const preferencesObj={
        UserId: process.env.SAMPLE_USER_ID ,
        MemeId: process.env.SAMPLE_MEME_ID,
        NewMemeLikeness: 13,
        CategoryIdList: ["1","2","3"] 
    }

    xit("should validate preferences object: UserId should be string", async () => {
        const badObj = Object.create(preferencesObj);
        badObj.UserId = 10; //Interger UserId => BAD
        try {
            await updatePreferenceServiceInstance.updateUserPreferences(badObj);
            expect(true).toBe(false);
        } catch (e) {
            console.log(e);
            expect(e.isBadRequest).toEqual(true);
        }
    });

    xit("should not increase likeness more than 100", async ()=> {
        const badObj = Object.create(preferencesObj);
        badObj.NewMemeLikeness = 200; 
        try {
            await updatePreferenceServiceInstance.updateUserPreferences(badObj);
            expect(true).toBe(false);
        } catch (e) {
            console.log(e);
            expect(e.message).toEqual(expect.stringContaining("Validation error"));
        }
    });

});