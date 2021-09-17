const CreateUserService = require("../../services/CreateUser");
const { db } = require("../../models");

describe("CreateUser Service", () => {
    const CreateUserServiceInstance = new CreateUserService();

    describe("Create instance of CreateUserService", () => {
        beforeAll(async () => {
            await db.sync();
        });
        xit("Is not null", () => {
            expect(CreateUserServiceInstance).not.toBeNUll;
        });
    })

})