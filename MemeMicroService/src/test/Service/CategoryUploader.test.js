const CategoryUploaderSVC = require("../../services/CategoryUploader") ;
const { db } = require("../../models");
require('dotenv').config();
const crypto = require("crypto");

describe("CategoryUploader Service",()=>{
  const categoryUploaderSVC = new CategoryUploaderSVC() ;

  beforeAll( async () => {
      await db.sync();
  });
  it("should upload categories", async() => {
    const randomIdList = [1,2,3].map((val) => (crypto.randomBytes(20).toString('hex')));
    try {
      const res = await categoryUploaderSVC.upload(
        process.env.SAMPLE_MEME_ID, ['cat1']
      );
      expect(res).toEqual(true);
    } catch (err) {
      console.log(err);
      expect(true).toEqual(false);
    }
  });
  it("should throw error if MemeId dne", async() => {
    const randomIdList = [1,2,3].map((val) => (crypto.randomBytes(20).toString('hex')));
    try {
      const res = await categoryUploaderSVC.upload(
        randomIdList[0], randomIdList
      );
      expect(false).toEqual(true);
    } catch (err) {
      console.log(err); 
      expect(true).toEqual(true);
    }
  });
});