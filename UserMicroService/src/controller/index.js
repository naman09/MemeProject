const { hash } = require('bcrypt');
const { getHashes } = require("crypto");
const  { AuthUserService, CreateUserService, UpdateUserPreferenceService, GetPreferencesService } = require("../services");
const createUserServiceInstance = new CreateUserService();
const authUserServiceInstance = new AuthUserService();
const updateUserPreferenceServiceInstance = new UpdateUserPreferenceService();
const getPreferecesServiceInstance = new GetPreferencesService() ;

const checkhealth = async (req, res, next) => {
  res.status(200).send({
    data:"User Micro Service working fine"
  })
}
//TODO Hash password afterwards
/*
  Input: userObj
  Output: data of new user
*/
const createUser = async (req, res, next) => {
  console.log("Inside create user");
    const userObj = req.body ;
    try{
        const results = await createUserServiceInstance.createUser(userObj);
        return res.status(200).send({
           data: results
        });
    } catch(err) {
        console.log("Error in createUser");
        next(err) ;
    }
    
}

/*
  Input: UserId, Passsword
  Output: token
*/

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

//TODO: it is like an internal function to be used by MemeMicro service ???

/*
  Input : UserId, MemeId, NewMemeLikeness, CategoryIdList
  Output: Success/Failure
*/
const updateUserPreferences =  async (req, res, next) => {
  console.log("Inside updateUserPreferences")
  const preferencesObj = req.body;
  try {
      await updateUserPreferenceServiceInstance.updateUserPreferences(preferencesObj);
      return res.status(200).send({
          data : {
              message:"User preferences updated successfully"
          }
      });
  } catch (err) {
      console.log("Error in updateUserPreferences");
      next(err);
  }
}

/*
  Input: userId
  Output: CategoryIdList
*/
const getUserCategories = async (req, res, next) => {
  console.log("Inside getUserCategories controller");
  try{
      const categoryIdList=await getPreferecesServiceInstance.getUserCategories(req.params.UserId);
      return res.status(200).send({
          data: {
              userCategories: categoryIdList 
          }
      })
      
  } catch(err){
      console.log("Error in getUserCategories controller");
      next(err) ;
  }
}


/*
  Input: UserId
  Output: MemeIdList
*/
const getFavMemes = async (req, res, next) => {
  console.log("Inside getFavMemes");
  try{
      const memeIdList = await getPreferecesServiceInstance.getFavMemes(req.params.UserId);
      return res.status(200).send({
          data:{
              favMemes: memeIdList 
          }
      });
  } catch(err){
      console.log("Error in getFavMemes");
      next(err);
  }
}

/*
  Input: userId, memeIdList
  Output: memeIdLikenessList}
*/

const getMemeLikeness = async (req, res, next) => {
  console.log("Inside getMemeLikeness controller");
  console.log(req.body)
  try {
      const memeIdLikenessList = await getPreferecesServiceInstance.getMemeLikeness(req.body.UserId, req.body.MemeIdList);
      return res.status(200).send({
          data: memeIdLikenessList
      })
  } catch (err) {
      console.log("Error in getMemeLikeness controller");
      next(err);
  } 
}
/*
  Input: UserId, MemeId, UserMemeLikeness
  Output: Success or Failure
*/
//TODO: Remove this. NO need as making separate calls to MEME_MS USER_MS from UI
const updateMemeLikeness = async(req, res, next) => {
  console.log("Inside updateMemeLikeness controller");
  try {
      //Update Meme, CategoryActivity Tables --> Call to MemeMicroService 
      const result = await getPreferecesServiceInstance.updatePreferences(req.body);
  } catch(err) {
    console.log("Error in updateMemeLikeness controller");
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
    updateUserPreferences,
    getUserCategories,
    getFavMemes,
    getMemeLikeness,
    updateMemeLikeness
}