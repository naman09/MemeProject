const request = require('supertest');
const app = require('../../server');
const fs = require('fs');
require('dotenv').config();
const { db } = require("../../models");


describe('Upload meme test', () => {

    beforeAll(async () => {
        await db.sync();
    });

    xit('should insert meme data', async () => {
        const imageData = "ABCSDD"; //for test only
        const memeObj = {
            MemeTitle: "First Meme Test",
            ActualData: imageData,
            UploadedBy: process.env.SAMPLE_USER_ID,
            TagList: ['tag1', 'tag2']
        };
        const res = await request(app)
            .post('/api/upload')
            .send(memeObj);
        expect(res.statusCode).toEqual(200);
    });

    xit('should update preferences', async () => {
        const preferenceObj = {
            UserId: process.env.SAMPLE_USER_ID,
            MemeId: process.env.SAMPLE_MEME_ID,
            NewMemeLikeness: 23,
            CategoryIdList: ["1", "2", "3"] //This ids should exists for this userId
        };

        const res = await request(app)
            .post("/api/upload2")
            .send(preferenceObj);

        expect(res.statusCode).toEqual(200);

    });
});