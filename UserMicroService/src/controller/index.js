const { hash } = require('bcrypt');
const { getHashes } = require("crypto");
const  { AuthUserSVC, CreateUserSVC, UserPreferenceUpdaterSVC, GetPreferencesSVC } = require("../services");
const createUserSVC = new CreateUserSVC();
const authUserSVC = new AuthUserSVC();
const userPreferenceUpdaterSVC = new UserPreferenceUpdaterSVC();
const getPreferencesSVC = new GetPreferencesSVC();


/*
  Input: userObj
  Output: data of new user
*/
const createUser = async (req, res, next) => {
  console.log("Inside create user");
    const userObj = req.body ;
    try{
        const results = await createUserSVC.createUser(userObj);
        return res.status(200).send({
           data: {
             token:results
           }
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
      const result = await authUserSVC.login(req.body.UserId, req.body.Password);
      if (result) {
          res.status(200).send({ //DONE : need to give userId as well (No need as client already has it)
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
const userPreferenceUpdater =  async (req, res, next) => {
  console.log("Inside userPreferenceUpdater");
  console.log(req.body);
  const preferencesObj = req.body;
  try {

      await userPreferenceUpdaterSVC.userPreferenceUpdater(preferencesObj);
      return res.status(200).send({
          data : {
              message:"User preferences updated successfully"
          }
      });
  } catch (err) {
      console.log("Error in userPreferenceUpdater");
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
      const categoryIdList=await getPreferencesSVC.getUserCategories(req.params.UserId);
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
      const memeIdList = await getPreferencesSVC.getFavMemes(req.params.UserId);
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
      const memeIdLikenessList = await getPreferencesSVC.getMemeLikeness(req.body.UserId, req.body.MemeIdList);
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
      // const result = await 
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
    createUser,
    login,
    userPreferenceUpdater,
    getUserCategories,
    getFavMemes,
    getMemeLikeness,
    updateMemeLikeness
}