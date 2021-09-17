const { Meme } = require('../models');
const { InputError, DBError } = require('../errors');

class GetTrendingMemes {
    constructor() { }

    async getTrendingMemes(pageNo, pageSize) {
        console.log("Inside getTrendingMeme SVC");
        if (pageNo < 0 || pageSize <= 0) {
            console.log("pageNo:" + pageNo + " pageSize:" + pageSize);
            console.log("Invalid page parameters");
            throw new InputError("Invalid page parameters");
        }
        try {
            let memeList = await Meme.findAll({
                limit: 100,
                order: [
                    ["UploadedAt", "DESC"],
                    ["TotalMemeLikeness", 'DESC']
                ]
            });
            memeList = memeList.map((meme) => ({
                MemeId: meme.dataValues.MemeId,
                MemeTitle: meme.dataValues.MemeTitle,
                TotalMemeLikeness: meme.dataValues.TotalMemeLikeness,
                MediaPath: meme.dataValues.MediaPath,
                MediaType: meme.dataValues.MediaType,
                ActivityCount: meme.dataValues.AllUsersMemeActivityCount
            }));
            return memeList;
        } catch (err) {
            throw new DBError(err);
        }

    }
}

module.exports = GetTrendingMemes;