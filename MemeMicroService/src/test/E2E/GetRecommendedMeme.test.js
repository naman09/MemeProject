const request = require('supertest');
const app = require('../../server');
const { db } = require("../../models");
require('dotenv').config();

describe('Get rec memes test', () => {
    beforeAll(async () => {
        await db.sync();
    });
    xit('should get memes', async () => {
        const res = await request(app)
            .get('/api/getRecommededMemes/')
            .send({
                pageNo: 1,
                pageSize: 1,
                UserId:'Naman1'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).not.toBeNull();
        console.log(res.body.data);
    });
});