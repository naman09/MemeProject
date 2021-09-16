const { MemeCategory } = require("../models");
const { DBError, InputError } = require("../errors");

class GetCategoriesForMeme {
  validateMemeId(memeId) {
    if (!memeId) {
      console.log("MemeId undefined");
      return false;
    }
    if (typeof (memeId) != "string") {
      console.log("MemeId type expected: string found: " + typeof (memeId));
    }
    return true;
  }
  async getCategoriesForMeme(memeId) {
    if (!this.validateMemeId(memeId)) {
      const error = new InputError("Invalid MemeId");
      error.isBadRequest(true);
      throw error;
    }
    try {
      const categoryList = await MemeCategory.findAll({
        where: {
          MemeId: memeId
        }
      });
      const categoryIdList = categoryList.map((category) => category.dataValues.CategoryId);
      return categoryIdList;
    } catch (err) {
      throw new DBError(err);
    }
  }
}

module.exports = GetCategoriesForMeme;