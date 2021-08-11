const request = require('supertest');
const app = require("../../server");
const { db, User } = require('../../models');
const crypto = require("crypto");
const { checkToken } = require("../../routes/token_validation");
require('dotenv').config();

describe('health check', () => {
    xit('should return OK if server is running',async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toStrictEqual('OK');
    });
});

describe('Login User', () => {
    beforeAll(async () => {
        await db.sync();
    });

    xit('should create a token if credentials are correct', async () => {
        const res = await request(app)
        .post('/api/login')
        .send({
            UserId: process.env.SAMPLE_USER_ID,
            Password: process.env.SAMPLE_PASSWORD
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
                Password: process.env.SAMPLE_PASSWORD,
            });
            expect(res.statusCode).toEqual(400);
        });
        
        xit('should check for password', async () => {
            const wrongPassword = process.env.SAMPLE_PASSWORD + "@";
            const res = await request(app)
            .post('/api/login')
            .send({
                UserId: process.env.SAMPLE_USER_ID,
                Password: wrongPassword
            });
            expect(res.statusCode).toEqual(400);
        }); 
    });
});

describe("Token Validation Middleware", () => {
    beforeAll(async () => {
        await db.sync();
    });

    xit("should validate token created after login", async () => {
        const res = await request(app)
        .post('/api/login')
        .send({
            UserId: process.env.SAMPLE_USER_ID,
            Password: process.env.SAMPLE_PASSWORD
        });
        const token = res.body.data.token;
        expect(token).not.toBeNull() ;

        const res2 = await request(app)
        .get('/api/checkToken')
        .set('Authorization', 'bearer ' + token); //bearer is added automatically 
        expect(res2.statusCode).toEqual(404); //standalone middleware
    });
});
