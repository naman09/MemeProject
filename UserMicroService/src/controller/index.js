const { hash } = require('bcrypt');
const { getHashes } = require("crypto");
const  { AuthUserService, CreateUserService, UpdatePreferenceService, GetPreferencesService } = require("../services");
const createUserServiceInstance = new CreateUserService();
const authUserServiceInstance = new AuthUserService();
const updatePreferenceServiceInstance = new UpdatePreferenceService();
const getPreferecesServiceInstance = new GetPreferencesService() ;

const checkhealth = async (req, res, next) => {
  res.status(200).send({
    data:"User Micro Service working fine"
  })
}
const createUser = async (req, res, next) => {
  console.log("Inside create user");
    const userObj = req.body ;
    try{
        const hashedPassword = await hash(userObj.Password, 10);
        userObj.Password = hashedPassword;
        const results = await createUserServiceInstance.createUser(userObj);
        return res.status(200).send({
           data: results
        });
    } catch(err) {
        console.log("Error in createUser");
        next(err) ;
    }
    
}

const login = async (req, res, next) => { 
    console.log("Inside login");
    try {
        const result = await authUserServiceInstance.login(req.body.UserId, req.body.Password);
        if (result) {
            res.status(200).send({
                data: {
                    token: result
                }
            });
        } else {
            const error = new Error("Invalid UserId or Passsword");
            error.isBadRequest = true;
            throw error ;
        }
    } catch(err){
        console.log("Error in login");   
        next(err);
    }
}

//TODO: it is like an internal function to be used by MemeMicro service
const updatePreferences =  async (req, res, next) => {
    console.log("Inside updatePreferences")
    const preferencesObj = req.body;
    try {
        await updatePreferenceServiceInstance.updateUserPreferences(preferencesObj);
        return res.status(200).send({
            data : {
                message:"User preferences updated successfully"
            }
        });
    } catch (err) {
        console.log("Error in updatePreferences");
        next(err);
    }
}

const getUserCategories = async (req, res, next) => {
    try{
        const categoryIdList=await getPreferecesServiceInstance.getUserCategories(req.params.UserId);
        return res.status(200).send({
            data: {
                userCategories: categoryIdList 
            }
        })
        
    } catch(err){
        console.log("Error in getUserCategories");
        next(err) ;
    }
}

const getFavMemes = async (req, res, next) => {
    console.log("Inside getFavMemes");
    try{
        const memeList = await getPreferecesServiceInstance.getFavMemes(req.params.UserId);
        return res.status(200).send({
            data:{
                favMemes: memeList 
            }
        });
    } catch(err){
        console.log("Error in getFavMemes");
        next(err);
    }
}

const getMemeLikeness = async (req, res, next) => {
    try {
        const result = await getPreferecesServiceInstance.getMemeLikeness(req.body.UserId, req.body.MemeIdList);
        return res.status(200).send({
            data: result
        })
    } catch (err) {
        console.log("Error in getMemeLikeness");
        next(err);
    } 
}



/*
TODO
[] route.get("/userCategories/:UserId") --> List of category id
[] route.get("/favmemes/:UserId") --> List of favourite memes id
[] route.put("/updatePreferences")
route.put("/likeness/:MemeId/:UserId")
route.get("/likeness/:MemeId/:UserId")
*/
module.exports = {
   checkhealth,
    createUser,
    login,
    updatePreferences,
    getUserCategories,
    getFavMemes,
    getMemeLikeness
}