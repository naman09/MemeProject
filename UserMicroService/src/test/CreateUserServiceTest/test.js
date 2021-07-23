const CreateUserService=require("../../services/CreateUserService") ;
const { db } = require("../../models");

describe("CreateUser Service",()=>{
    const CreateUserServiceInstance = new CreateUserService() ;

    describe("Create instance of CreateUserService",()=>{
        beforeAll(() => {
            db.sync();
        });
        test("Is not null",()=>{
            expect(CreateUserServiceInstance).not.toBeNUll 
        });
        test("Create new user",()=>{
            console.log(CreateUserServiceInstance.createUser({UserId:"Shubham",Password:"ANSvjdsd1@#"}))
            expect(CreateUserServiceInstance.createUser({UserId:"Shubham",Password:"ANSvjdsd1@#"}).success).toBeTruthy()
        });
    })
    
})