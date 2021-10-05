const { FindCategoriesSVC, RemTextInImageSVC, AddNewCategorySVC } = require("../services"); 
const findCategoriesSVC = new FindCategoriesSVC();
const remTextInImageSVC = new RemTextInImageSVC();
const addNewCategorySVC = new AddNewCategorySVC();

const getCategories = async (req, res, next) => {
    console.log("Inside getCategories controller");
    try {
        console.log(req.body);
        const resultImgPath = await remTextInImageSVC.remTextInImage(req.body.memeUrl);
        const categoriesMatched = await findCategoriesSVC.findCategories(resultImgPath);
        if (categoriesMatched.length !== 0) {
            return res.status(200).send({
                data: categoriesMatched
            });
        }
        //remove files
        const newCategory = await addNewCategorySVC.addNewCategory(resultImgPath);
        res.status(200).send({
            data: [newCategory]
        });
    } catch(err) {
        console.log("Error caught in getCategories controller");
        next(err);
    }
}

module.exports = {
    getCategories
};