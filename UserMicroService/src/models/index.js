const Sequelize=require('sequelize') ;
require('dotenv').config();

const { DataTypes } = require('sequelize');
const path = `mysql://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/UserDB` ;

const db = new Sequelize(path, {
    define: {
        timestamps: false
    }
});

const User = db.define('User',{
    UserId:{
        type:Sequelize.STRING,
        primaryKey: true
    },
    Password:{
        type:Sequelize.STRING,
    }
});

//This table contains the Memes which user has liked.
const UserMeme = db.define('UserMeme', {
    MemeId : { //Treated like a foreign key of Meme.MemeId
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    UserMemeLikeness: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            max: 100,
            min: -100
        }
    },
    LastUpdatedAt: {
        type: Sequelize.DATE, //DATETIME in mysql
        allowNull: false,
    }

});

User.hasMany(UserMeme, {
    foreignKey: {
        name: 'UserId',
        primaryKey: true,
        allowNull: false,
    }
});

// UserMeme.belongsToMany(Users)
const UserCategory = db.define('UserCategory', {
    AccessCount: {
        type:DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    UserActivityCount:{
        type:DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    UserCategoryLikeness:{
        type:DataTypes.BIGINT(11),
        defaultValue: 0,
        allowNull: false 
    },
    CategoryId:{
        type:DataTypes.STRING,
        allowNull: false ,
        primaryKey:true 
    }
});

User.hasMany(UserCategory,{
    foreignKey:{
        name:'UserId',
        primaryKey:true,
        allowNull: false,
    }
});

module.exports = {
    db,
    User
};