const request = require('supertest');
const app = require("../../server");
const { db } = require('../../models');
const crypto = require("crypto");
const { checkToken } = require("../../routes/token_validation");


describe('health check', () => {
    xit('should return OK if server is running',async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        console.log(res.text);
        expect(res.text).toStrictEqual('OK');
    });
});

describe('Login User', () => {
    beforeAll( async () => {
        await db.sync();
    });

    xit('should create a token if credentials are correct', async () => {
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
        xit('should give error if user does not exist', async () => {
            const res = await request(app)
            .post('/api/login')
            .send({
                UserId: randomUserId,
                Password: "Aa7@aa"
            });
            expect(res.statusCode).toEqual(400);
        });
        
        xit('should check for password', async () => {
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

describe("Token Validation Middleware", () => {
    beforeAll(async () => {
        await db.sync();
    });

    it("should validate token created after login", async() => {
        const res = await request(app)
        .post('/api/login')
        .send({
            UserId: "43f75d5470b258bba1ba1e7a0c1eb734289a50cc",
            Password: "Aa7@aaaaaaaaa"
        });
        // console.log(res.data);
        const token = res.body.data.token;
        console.log(token);
        expect(token).not.toBeNull() ;

        const res2 = await request(app)
        .get('/api/checkToken')
        .set('Authorization', 'bearer ' + token); //bearer is added automatically 
        console.log(res2.body.error);
        expect(res2.statusCode).toEqual(404);
    });
});