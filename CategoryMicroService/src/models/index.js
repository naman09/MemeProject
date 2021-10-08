const Sequelize = require('sequelize');
require('dotenv').config();

const { DataTypes } = require('sequelize');
const constants = require('../constants');
const path = `mysql://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

console.log(path);

const db = new Sequelize(path, {
    define: {
        timestamps: false
    }
});


const Category = db.define('Category',{
    CategoryId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    CategoryInfo: {
        type: DataTypes.STRING
    }
});

module.exports = {
    Category,
    db
};