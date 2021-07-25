const request = require('supertest');
const app = require("../../server");
const { db } = require('../../models');
const crypto = require("crypto");

describe('health check', () => {
    it('should return OK if server is running',async () => {
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

    it('should create a new user',async ()=>{
        
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
    it('should password validation error',async ()=>{
        const res = await request(app)
        .post('/api/create')
        .send({
            UserId:"Shubham",
            Password:"Pal"
        });
        expect(res.statusCode).toEqual(400) ;
    });
    it('should give UserId already exist error',async ()=>{
        const res = await request(app)
        .post('/api/create')
        .send({
            UserId: randomUserId,
            Password: password
        });
        expect(res.statusCode).toEqual(500) ;
    });
});


describe('Login User', () => {
    beforeAll( async () => {
        await db.sync();
    });

    it('should create a token if credentials are correct', async () => {
        const res = await request(app)
        .post('/api/login')
        .send({
            UserId: "OM",
            Password: "Aa7@aaaaaaaaa"
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.token).not.toBeNull;
    });
    const randomUserId = crypto.randomBytes(20).toString('hex');
    describe("Wrong Credentitals", () => {
        it('should give error if user does not exist', async () => {
            const res = await request(app)
            .post('/api/login')
            .send({
                UserId: randomUserId,
                Password: "Aa7@aa"
            });
            expect(res.statusCode).toEqual(400);
        });
        
        it('should check for password', async () => {
            const res = await request(app)
            .post('/api/login')
            .send({
                UserId: "OM",
                Password: "Aa7@aa"
            });
            expect(res.statusCode).toEqual(400);
        }); 
    });
});