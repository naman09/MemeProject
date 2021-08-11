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
            let memeList = await Meme.findAll({
                limit: 100,
                order:[
                    ["UploadedAt","DESC"],
                    ["TotalMemeLikeness",'DESC']
                ]
            });
            memeList = memeList.map((meme) => ({
                MemeId: meme.dataValues.MemeId,
                MemeTitle: meme.dataValues.MemeTitle,
                TotalMemeLikeness: meme.dataValues.TotalMemeLikeness,
                ActualData: meme.dataValues.ActualData
            }));
            return memeList ;
        } catch (err) {
            throw new DBError(err) ;
        }
        
    }
}

module.exports = FetchTrendingMemes;