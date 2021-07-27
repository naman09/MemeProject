const request = require('supertest');
const app = require("../../server") ;
const { UserMeme, UserCategory } = require('../../models');

describe('Get User preferences',()=>{
    beforeAll( async () => {
        await db.sync();
    });
    it('should get list of UserMeme ids', async ()=>{
        const res = await request(app)
        .get('/api/favMemes/OM')
        
        expect(res.body.data.favMemes).not.toBeNull();
    });

    it('should get list of UserCategories id', async() => {
        const res = await request(app)
        .get('/api/userCategories/OM')

        expect(res.body.data).not.toBeNull();
    });

})