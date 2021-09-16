const Sequelize = require('sequelize');
require('dotenv').config();

const { DataTypes } = require('sequelize');
const constants = require('../constants');
const path = `mysql://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}` ;

console.log(path);

const db = new Sequelize(path, {
    define: {
        timestamps: false
    }
});

const Meme = db.define('Meme', {
    MemeId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    MediaPath: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    OriginalMediaName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    MediaType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    MemeTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    TotalMemeLikeness: {
        type: DataTypes.BIGINT(11),
        defaultValue: constants.NEW_MEME_LIKENESS_DEFAULT,
        allowNull: false,
    },
    UploadedAt: {
        type: DataTypes.DATE, //DATETIME in mysql
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    UploadedBy: {
        type: DataTypes.STRING, //UserId
        allowNull: false,
    },
    AllUsersMemeActivityCount: {
        type: DataTypes.INTEGER,
        defaultValue: constants.NEW_MEME_ACTIVITY_COUNT,
        allowNull: false,
    }
});

const Tag = db.define('Tag',{
    TagName:{
        type: DataTypes.STRING,
        primaryKey: true  
    },
    MemeCount:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0        
    }
});

const MemeTag = db.define('MemeTag', {
    TagName:{
        type: DataTypes.STRING,
        primaryKey: true  
    },
    MemeId: {
        type: DataTypes.STRING,
        primaryKey: true,
    }
});

Meme.hasMany(MemeTag,{
    foreignKey: {
        name: 'MemeId',
        primaryKey: true,
        allowNull: false
    }
});

Tag.hasMany(MemeTag,{
    foreignKey: {
        name: 'TagName',
        primaryKey: true,
        allowNull: false
    }
});

const CategoryActivity = db.define('CategoryActivity',{
    CategoryId:{
        type: DataTypes.STRING,
        primaryKey: true 
    },
    TotalCategoryLikeness: {
        type:DataTypes.BIGINT(11),
        defaultValue: 0,
        allowNull: false 
    },
    AllUsersCategoryActivityCount: {
        type: DataTypes.BIGINT(11),
        defaultValue: 0,
        allowNull: false 
    }
});

const MemeCategory = db.define('MemeCategory', {
    MemeId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    CategoryId:{
        type: DataTypes.STRING,
        primaryKey: true 
    },

});

Meme.hasMany(MemeCategory, {
    foreignKey: {
        name: 'MemeId',
        primaryKey: true,
        allowNull: false,
    }
});

CategoryActivity.hasMany(MemeCategory, {
    foreignKey: {
        name: 'CategoryId',
        primaryKey: true, 
        allowNull: false,
    }
});

module.exports = {
    db,
    Meme,
    Tag,
    MemeTag,
    CategoryActivity,
    MemeCategory
};