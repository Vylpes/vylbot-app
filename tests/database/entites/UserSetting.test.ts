import AppDataSource from "../../../src/database/dataSources/appDataSource";
import UserSetting from "../../../src/database/entities/UserSetting";

describe("constructor", () => {
    let userSetting: UserSetting;

    beforeEach(() => {
        userSetting = new UserSetting("userId", "key", "value");
    });

    test("EXPECT settings to be configured", () => {
        expect(userSetting).toMatchSnapshot({
            Id: expect.any(String),
            WhenCreated: expect.any(Date),
            WhenUpdated: expect.any(Date),
        });
    });
});

describe("UpdateValue", () => {
    let userSetting: UserSetting;

    beforeEach(() => {
        userSetting = new UserSetting("userId", "key", "value");

        userSetting.UpdateValue("newValue");
    });

    test("EXPECT value to be updated", () => {
        expect(userSetting.Value).toBe("newValue");
    });
});

describe("FetchOneByKey", () => {
    let result: UserSetting | null;
    let userSetting: UserSetting;

    let findOneMock: jest.Mock;

    beforeEach(async () => {
        userSetting = new UserSetting("userId", "key", "value");

        findOneMock = jest.fn().mockResolvedValue(userSetting);

        AppDataSource.getRepository = jest.fn().mockReturnValue({
            findOne: findOneMock,
        });

        result = await UserSetting.FetchOneByKey("userId", "key");
    });

    test("EXPECT getRepository to have been called", () => {
        expect(AppDataSource.getRepository).toHaveBeenCalledTimes(1);
        expect(AppDataSource.getRepository).toHaveBeenCalledWith(UserSetting);
    });

    test("EXPECT repository.findOne to have been called", () => {
        expect(findOneMock).toHaveBeenCalledTimes(1);
        expect(findOneMock).toHaveBeenCalledWith({ where: { UserId: "userId", Key: "key" }, relations: {}});
    })

    test("EXPECT single entity returned", () => {
        expect(result).toBe(userSetting);
    });
});
