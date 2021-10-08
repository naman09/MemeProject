const request = require('supertest');
const app = require('../../server');
const fs = require('fs');
require('dotenv').config();
const { db } = require("../../models");


describe('Fetch trending memes test', () => {

    beforeAll(async () => {
        await db.sync();
    });

    xit('should get memes', async () => {
        const res = await request(app)
            .get('/api/fetchTrendingMemes/')
            .send({
                pageNo: 1,
                pageSize: 1
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.TrendingMemeList).not.toBeNull();

    });


});