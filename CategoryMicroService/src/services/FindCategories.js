const deepai = require('deepai');
const fs = require("fs");
const { Category } = require('../models');
require('dotenv').config();

class FindCategories {
    constructor() {}
    async imageSimilarity(imgPath1,imgPath2) {
        // throw Error("GGGG");
        deepai.setApiKey(process.env.IMAGE_SIMILARITY_API_KEY);
        const res = await deepai.callStandardApi("image-similarity", {
                image1: fs.createReadStream(imgPath1),
                image2: fs.createReadStream(imgPath2),
        });
        console.log(res);
        if (res.output.distance <= process.env.IMAGE_DIS_THRESH) {
            console.log("Images are similar");
            return true;
        }
        return false;
    }
    async getAllExistingCategories() {
        const categoryWrapperList = await Category.findAll();
        return categoryWrapperList.map((category) => category.dataValues);
    }
    async findCategories(memePath) {
        const existingCategories = await this.getAllExistingCategories();
        console.log(existingCategories);
        const promiseList = existingCategories.map((category) => this.imageSimilarity(category.CategoryInfo, memePath));
        const result = await Promise.all(promiseList);
        const categoriesMatched = [];
        for(let idx in result) {
            if (result[idx]) {
                categoriesMatched.push(existingCategories[idx].CategoryId);
            }
        }
        console.log("Categories matched are : " + categoriesMatched);
        return categoriesMatched;
    }
}

module.exports = FindCategories;