const { Meme, CategoryActivity, db } = require("../models");
const { Op, literal } = require('sequelize');
const { InputError, DBError } = require("../errors");

/*
  Input: updateObj{MemeId, CategoryIdList, DeltaMemeLikeness,DeltaActivityCount}
*/
class LikeUpdater {
  constructor() { }

  validateUpdateObj(updateObj) {
    if (!updateObj) {
      console.log("updateObj cannot be undefined");
      return false;
    }
    if (!updateObj.MemeId) {
      conosole.log("MemeId cannot be undefined");
      return false;
    }
    if (typeof (updateObj.MemeId) !== "string") {
      console.log("MemeId type expected string found " + typeof (updateObj.MemeId));
      return false;
    }
    if (!updateObj.CategoryIdList) {
      console.log("CategoryIdList cannot be undefined");
      return false;
    }
    if (!updateObj.CategoryIdList.length) {
      console.log("CategoryActivity cannot be empty");
      return false;
    }
    if (typeof (updateObj.CategoryIdList[0]) !== "string") {
      console.log("CategoryId expected string found " + typeof (updateObj.CategoryIdList[0]));
      return false;
    }
    if (typeof (updateObj.DeltaMemeLikeness) !== "number") {
      console.log("DeltaMemeLikeness expected number found " + typeof (updateObj.DeltaMemeLikeness));
      return false;
    }
    if (typeof (updateObj.DeltaActivityCount) !== "number") {
      console.log("DeltaActivityCount expected number found " + typeof (updateObj.DeltaActivityCount));
      return false;
    }
    return true;
  }
  async updateMeme(updateObj, transaction) {
    return Meme.update({
      TotalMemeLikeness: literal(`TotalMemeLikeness + ${updateObj.DeltaMemeLikeness}`),
      AllUsersMemeActivityCount: literal(`AllUsersMemeActivityCount + ${updateObj.DeltaActivityCount}`)
    }, {
      where: {
        MemeId: updateObj.MemeId
      }
    }, { transaction: transaction })
  }

  async updateCategoryActivity(updateObj, transaction) {
    return CategoryActivity.update({
      TotalCategoryLikeness: literal(`TotalCategoryLikeness + ${updateObj.DeltaMemeLikeness}`),
      AllUsersCategoryActivityCount: literal(`AllUsersCategoryActivityCount + ${updateObj.DeltaActivityCount}`)
    }, {
      where: {
        CategoryId: {
          [Op.in]: updateObj.CategoryIdList
        }
      }
    }, { transaction: transaction });
  }

  async update(updateObj) {
    console.log("Inside likeUpdater SVC");
    if (!this.validateUpdateObj(updateObj)) {
      throw new InputError("Invalud update Object");
    }
    const transaction = await db.transaction();
    try {
      await Promise.all([
        this.updateCategoryActivity(updateObj, transaction),
        this.updateMeme(updateObj, transaction)
      ])
      await transaction.commit();
      console.log("Transaction commited successfully!");
    } catch (err) {
      await transaction.rollback();
      throw new DBError(err);
    }
    return true;
  }
}

module.exports = LikeUpdater;