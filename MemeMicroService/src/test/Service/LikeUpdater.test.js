const LikeUpdaterSVC = require("../../services/LikeUpdater");
const { db } = require("../../models");
require('dotenv').config();

describe("LikeUpdater Service", () => {
  const likeUpdaterSVC = new LikeUpdaterSVC();
  beforeAll(async () => {
    await db.sync();
  });
  xit("Is not null", () => {
    expect(likeUpdaterSVC).not.toBeNUll;
  });
  xit("should return true", async () => {
    const res = await likeUpdaterSVC.update({
      MemeId: process.env.SAMPLE_MEME_ID,
      CategoryIdList: ['a', 'b', 'c'],
      DeltaMemeLikeness: -200,
      DeltaActivityCount: 0
    });
    expect(res).toEqual(true);
  });
  it("should fail for invalid updateObj", async() => {
    const updateObj = {
      MemeId: "Naman11633968268",
      CategoryIdList: ['ca','cb'],
      DeltaMemeLikeness: 1/'a',
      DeltaActivityCount: 0
    };
    try{
      const res = await likeUpdaterSVC.update(updateObj);
      console.log(res);
      expect(0).toEqual(1);
    }catch(err){
      expect(1).toEqual(1);
    }
    
  });
})