const request = require('supertest');
const app = require("../../server");
const { db } = require('../../models');
const crypto = require("crypto");

describe('health check', () => {
    xit('should return OK if server is running',async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        console.log(res.text);
        expect(res.text).toStrictEqual('OK');
    });
});


describe('Create User',() => {
    beforeAll( async () => {
        await db.sync();
    });
    const randomUserId = crypto.randomBytes(20).toString('hex');
    const password = "Aa7@aaaaaaaaa";  
    console.log(randomUserId,typeof(randomUserId))  ;

    xit('should create a new user',async ()=>{
        
        const res = await request(app)
        .post('/api/create')
        .send({
            UserId:randomUserId,
            Password:password
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('UserId') ;
        expect(res.body.data).toHaveProperty('Password');
    });
    xit('should password validation error',async ()=>{
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
            UserId: randomUserId,
            Password: password
        });
        expect(res.statusCode).toEqual(400);

    });
});