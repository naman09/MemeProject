const { MemeCategory, db, CategoryActivity } = require('../models');
const { DBError, InputError } = require("../errors");

/*
  Insert data into CategoryActivity and MemeCategory tables
*/
class CategoryUploader {
  validateInput(memeId, categoryIdList) {
    if (!memeId) {
      console.log("MemeId cannot be null");
      return false;
    }
    if (typeof (memeId) !== "string") {
      console.log("MemeId expected string found " + typeof (memeId));
      return false;
    }
    if (!categoryIdList) {
      console.log("CategoryIdList cannot be null");
      return false;
    }
    if (categoryIdList.length === 0) {
      console.log("CategoryIdList cannot be empty");
      return false;
    }
    for (let idx in categoryIdList) { //TODO : Do like this for every validation
      const categoryId = categoryIdList[idx];
      if (typeof (categoryId) !== "string") {
        console.log("CategoryId at index " + idx + "expected string found " + typeof (categoryId));
        return false;
      }
    }
    return true;
  }


  async uploadMemeCategory(memeId, categoryIdList, transaction) {
    const values = categoryIdList.map((categoryId) => (
      { MemeId: memeId, CategoryId: categoryId }
    ));
    return MemeCategory.bulkCreate(values, { transaction: transaction });
  }

  async uploadCategoryActivity(categoryIdList, transaction) {
    const values = categoryIdList.map((categoryId) => (
      { CategoryId: categoryId, TotalCategoryLikeness: 0, AllUsersCategoryActivityCount: 0 }
    ));
    return CategoryActivity.bulkCreate(values, { ignoreDuplicates: true, transaction: transaction });
  }


  async upload(memeId, categoryIdList) {
    console.log("Inside categoryUploader SVC");
    if (!this.validateInput(memeId, categoryIdList)) {
      throw new InputError("Invalid memeId and categoryIdList");
    }
    // const categoryActivityUpsertQuery = this.getCategoryActivityUpsertQuery(categoryIdList);
    const transaction = await db.transaction();
    try {
      await this.uploadCategoryActivity(categoryIdList, transaction);
      await this.uploadMemeCategory(memeId, categoryIdList, transaction);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw new DBError(err);
    }
    return true;
  }
}

module.exports = CategoryUploader;