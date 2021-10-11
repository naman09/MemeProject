const { DBError } = require('../../../MemeMicroService/src/errors');
const { Category } = require('../models');

class AddNewCategory {
    getNewId() {
        return String(new Date().getTime());
    }
    async addNewCategory(memePath) {
        try {
            let category = await Category.create({
                CategoryId: this.getNewId(),
                CategoryInfo: memePath
            });
            return category;
        } catch (err) {
            throw DBError(err);
        }
    }
}

module.exports = AddNewCategory;