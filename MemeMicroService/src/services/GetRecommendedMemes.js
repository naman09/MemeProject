const { MemeCategory, Meme } = require("../models");
const { Op } = require('sequelize');
const { DBError } = require("../errors");

class GetRecommendedMemes {
  cmp(memeA, memeB) {
    const likenessA = memeA.TotalMemeLikeness / memeA.AllUsersMemeActivityCount;
    const likenessB = memeB.TotalMemeLikeness / memeB.AllUsersMemeActivityCount;
    console.log("A : ", likenessA, "B : ", likenessB);
    return likenessB - likenessA;
  }

  //TODO: To get more memes from more like categories instead of just 5
  getTopMemes(memeList, memeCategoryList) {
    const memeIdMemeMap = new Map();
      for (let meme of memeList) {
        memeIdMemeMap.set(meme.MemeId, meme);
      }
      const categoryIdMemeMap = new Map();
      for (let { CategoryId, MemeId } of memeCategoryList) {
        let memeList = [];
        if (categoryIdMemeMap.has(CategoryId)) {
          memeList = categoryIdMemeMap.get(CategoryId)
        }
        memeList.push(memeIdMemeMap.get(MemeId));
        categoryIdMemeMap.set(CategoryId, memeList);
      }
      let finalMemeList = [];
      for (let [category, memeList] of categoryIdMemeMap) {
        memeList.sort(this.cmp);
        finalMemeList = finalMemeList.concat(memeList.slice(0, 5));
      }
      console.log(finalMemeList[0]);
      return finalMemeList;
  }

  async getRecommendedMemes(pageNo, pageSize, userCategories) {
    console.log("Inside getRecommendedMemes SVC");
    console.log(userCategories);
    try {
      //TODO : Don't extract all memes, take few-few memes from all categories
      let memeCategoryList = await MemeCategory.findAll({
        where: {
          CategoryId: {
            [Op.in]: userCategories
          }
        }
      });
      //SELECT * FROM MEMECATEGORY where Category IN (userCategories) GROUP BY Category LIMIT 10  
      memeCategoryList = memeCategoryList.map(memeCategory => memeCategory.dataValues);
      const memeIdList = memeCategoryList.map(meme => meme.MemeId);
      console.log(memeIdList);
      let memeList = await Meme.findAll({
        where: {
          MemeId: {
            [Op.in]: memeIdList
          }
        }
      });
      memeList = memeList.map(meme => meme.dataValues);
      console.log(memeList[0]);
      return this.getTopMemes(memeList, memeCategoryList);
    } catch (err) {
      throw new DBError(err);
    }
  }
}
module.exports = GetRecommendedMemes;