const { FindCategoriesSVC } = require("../../services");
const findCategoriesSVC = new FindCategoriesSVC();
const { db } = require("../../models");

describe("Find Categories", () => {
    beforeAll(async () => {
        await db.sync();
    })
    xit("return empty list for a new image", async () => {
        const res = await findCategoriesSVC.findCategories("http://localhost:5556/media/Naman116318065601.jpg");
        expect(res.length).toEqual(0);
    });
});