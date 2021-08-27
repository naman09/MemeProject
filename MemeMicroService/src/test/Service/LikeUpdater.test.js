const LikeUpdaterSVC = require("../../services/LikeUpdater") ;
const { db } = require("../../models");
require('dotenv').config();

describe("LikeUpdater Service",()=>{
  const likeUpdaterSVC = new LikeUpdaterSVC() ;
  beforeAll( async () => {
    await db.sync();
  });
  xit("Is not null",() => {
      expect(likeUpdaterSVC).not.toBeNUll;
  });
  xit("should return true",async ()=>{
    const res = await likeUpdaterSVC.update({
      MemeId: process.env.SAMPLE_MEME_ID,
      CategoryIdList: ['a','b','c'],
      DeltaMemeLikeness: -200,
      DeltaActivityCount: 0
    });
    expect(res).toEqual(true);
  })
    
})