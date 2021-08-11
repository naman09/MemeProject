const request = require('supertest');
const app = require("../../server");
const { db } = require('../../models');
const crypto = require("crypto");

describe('Create User',() => {
    beforeAll( async () => {
        await db.sync();
    });
    

    xit('should create a new user',async ()=>{
        const randomUserId = crypto.randomBytes(20).toString('hex');
        console.log(randomUserId,typeof(randomUserId));
        
        const res = await request(app)
        .post('/api/create')
        .send({
            UserId: randomUserId,
            Password: process.env.SAMPLE_PASSWORD
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('UserId') ;
        expect(res.body.data).toHaveProperty('Password');
    });
    xit('should give password validation error',async ()=>{
        const res = await request(app)
        .post('/api/create')
        .send({
            UserId:"Shubham",
            Password:"Pal"
        });
        expect(res.statusCode).toEqual(400) ;
    });
    xit('should give UserId already exist error',async ()=>{
        const res = await request(app)
        .post('/api/create')
        .send({
            UserId: process.env.SAMPLE_USER_ID,
            Password: process.env.SAMPLE_PASSWORD
        });
        expect(res.statusCode).toEqual(400);
    });
});