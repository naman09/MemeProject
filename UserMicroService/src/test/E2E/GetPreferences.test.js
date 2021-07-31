const request = require('supertest');
const app = require("../../server") ;
const { UserMeme, UserCategory, db } = require('../../models');
require('dotenv').config();

describe('Get User preferences',()=>{
    beforeAll( async () => {
        await db.sync();
    });
    const userId = process.env.SAMPLE_USER_ID;
    const memeId= process.env.SAMPLE_MEME_ID;
    
    it('should get list of UserCategories id', async() => {
        const res = await request(app)
        .get(`/api/userCategories/${userId}`)
        expect(res.statusCode).toEqual(200) ;
        expect(res.body.data.userCategories).not.toBeNull();
    });

    it('should get list of UserMeme ids', async ()=>{
        const res = await request(app)
        .get(`/api/favMemes/${userId}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.favMemes).not.toBeNull();
    });
});

describe("User Meme Likeness", () => {
    beforeAll(async() => {
        await db.sync();
    });
    const userId = process.env.SAMPLE_USER_ID;
    const memeId= process.env.SAMPLE_MEME_ID;

    it('should get memeLikeness', async ()=>{
        const res = await request(app)
        .get(`/api/memeLikeness/${userId}/${memeId}`)
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.memeLikeness).toEqual(23);
    });
});