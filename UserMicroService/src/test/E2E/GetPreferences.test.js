const request = require('supertest');
const app = require("../../server");
const { UserMeme, UserCategory, db } = require('../../models');
require('dotenv').config();

describe('Get User preferences', () => {
    beforeAll(async () => {
        await db.sync();
    });
    const userId = process.env.SAMPLE_USER_ID;
    const memeId = process.env.SAMPLE_MEME_ID;

    xit('should get list of UserCategories id', async () => {
        const res = await request(app)
            .get(`/api/userCategories/${userId}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.userCategories).not.toBeNull();
    });

    xit('should get list of UserMeme ids', async () => {
        const res = await request(app)
            .get(`/api/favMemes/${userId}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.favMemes).not.toBeNull();
    });
});

describe("User Meme Likeness", () => {
    beforeAll(async () => {
        await db.sync();
    });
    const userId = process.env.SAMPLE_USER_ID;
    const memeId = process.env.SAMPLE_MEME_ID;

    xit('should get list of userMemeLikeness', async () => {
        const res = await request(app)
            .get(`/api/memeLikeness`).send({
                UserId: userId,
                MemeIdList: [memeId]
            });
        expect(res.statusCode).toEqual(200);
        const memeLikeList = res.body.data;
        if (memeLikeList.length) {
            expect(res.body.data[0].UserMemeLikeness).toEqual(23);
        }
    });
});