const { Meme } = require('../models');
const { InputError, DBError } = require('../errors');

class FetchTrendingMemes {
    constructor() {}

    async fetchTrendingMemes(pageNo, pageSize) {
        if (pageNo < 0 || pageSize <= 0) {
            console.log("Invalid page parameters");
            throw new InputError("Invalid page parameters");
        } 
        try{
            const memeList = Meme.findAll({
                order:[
                    ["LastUpdatedAt","ASC"],
                    ["UserMemeLikeness",'DESC']
                ]
            });
            memeList = memeList.map((meme) => ({
                MemeId: meme.dataValues.MemeId,
                MemeTitle: meme.dataValues.MemeTitle,
                ActualData: meme.dataValues.ActualData
            }));
            return memeList ;

        } catch (err) {
            throw new DBError(err) ;
        }
        
    }
}

module.exports = FetchTrendingMemes;