const request = require('supertest');
const app = require('../../server');
const { db } = require("../../models");

describe('Get Categories', () => {
    jest.setTimeout(30000);
    beforeAll(async () => {
        await db.sync();
    });
    it('should return categoryId list', async () => {
        const res = await request(app)
            .post('/api/getCategories')
            .send({
                memeUrl: "https://www.researchgate.net/publication/343598792/figure/fig3/AS:923535321100290@1597199387665/Drake-dislikes-Sleep-Drake-likes-Playing-Viddeo-Games-till-5am.jpg"
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).not.toBeNull();
        expect(res.body.data.length).not.toEqual(0);
        console.log(res.body.data); 
    });
});