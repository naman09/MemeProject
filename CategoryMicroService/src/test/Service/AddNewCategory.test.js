const { AddNewCategorySVC } = require("../../services");
const addNewCategoriesSVC = new AddNewCategorySVC();
const { db } = require("../../models");

describe("Add new category", () => {
    beforeAll( async ()=>{
        await db.sync();
    });
    xit("should return a new category id", async () => {
        // await addNewCategoriesSVC.addNewCategory();
    });
});