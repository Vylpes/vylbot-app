import { CommandInteraction, EmbedBuilder } from "discord.js";
import AddMoon from "../../../../src/commands/304276391837302787/moons/add";
import Moon from "../../../../src/database/entities/304276391837302787/Moon";
import UserSetting from "../../../../src/database/entities/UserSetting";

describe("GIVEN happy flow", () => {
    let repliedWithEmbed: EmbedBuilder[] | undefined;
    let savedMoon: Moon | undefined;

    const interaction = {
        reply: jest.fn((options: any) => {
            repliedWithEmbed = options.embeds;
        }),
        options: {
            get: jest.fn()
                .mockReturnValueOnce({
                    value: "Test Description",
                }),
        },
        user: {
            id: "userId",
        },
    } as unknown as CommandInteraction;

    const userSetting = {
        Value: 1,
        UpdateValue: jest.fn(),
        Save: jest.fn(),
    };

    beforeAll(async () => {
        Moon.FetchMoonCountByUserId = jest.fn().mockResolvedValue(1);
        Moon.prototype.Save = jest.fn().mockImplementation((_, entity: Moon) => {
            savedMoon = entity;
        });

        UserSetting.FetchOneByKey = jest.fn().mockResolvedValue(userSetting);

        await AddMoon(interaction);
    });

    test("EXPECT description option to have been fetched", () => {
        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("description", true);
    });

    test("EXPECT UserSetting to have been fetched", () => {
        expect(UserSetting.FetchOneByKey).toHaveBeenCalledTimes(1);
        expect(UserSetting.FetchOneByKey).toHaveBeenCalledWith("userId", "moons");
    });

    test("EXPECT moonCount to be updated +1", () => {
        expect(userSetting.UpdateValue).toHaveBeenCalledTimes(1);
        expect(userSetting.UpdateValue).toHaveBeenCalledWith("2");
    });

    test("EXPECT setting to be saved", () => {
        expect(userSetting.Save).toHaveBeenCalledTimes(1);
        expect(userSetting.Save).toHaveBeenCalledWith(UserSetting, userSetting);
    });

    test("EXPECT moon to be saved", () => {
        expect(Moon.prototype.Save).toHaveBeenCalledTimes(1);
        expect(Moon.prototype.Save).toHaveBeenCalledWith(Moon, expect.any(Moon));

        expect(savedMoon).toBeDefined();
        expect(savedMoon).toMatchSnapshot({
            Id: expect.any(String),
            WhenCreated: expect.any(Date),
            WhenUpdated: expect.any(Date),
        });
    });

    test("EXPECT embed to be replied", () => {
        expect(interaction.reply).toHaveBeenCalledTimes(1);

        expect(repliedWithEmbed).toBeDefined();
        expect(repliedWithEmbed).toMatchSnapshot();
    });
});

describe("GIVEN description is null", () => {
    test.todo("EXPECT error replied");
});

describe("GIVEN description is greater than 255 characters", () => {
    test.todo("EXPECT error replied");
});

describe("GIVEN moon count setting exists", () => {
    test.todo("EXPECT existing entity to be updated");
});

describe("GIVEN moon count setting does not exist", () => {
    test.todo("EXPECT new entity to be created");
});