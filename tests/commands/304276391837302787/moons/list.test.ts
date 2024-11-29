import { ActionRowBuilder, APIEmbed, ButtonBuilder, CommandInteraction, EmbedBuilder, InteractionReplyOptions } from "discord.js";
import List from "../../../../src/commands/304276391837302787/moons/list";
import Moon from "../../../../src/database/entities/304276391837302787/Moon";
import UserSetting from "../../../../src/database/entities/UserSetting";

describe("GIVEN happy flow", () => {
    let repliedWith: InteractionReplyOptions | undefined;

    const interaction = {
        reply: jest.fn((options) => {
            repliedWith = options;
        }),
        options: {
            get: jest.fn()
                .mockReturnValueOnce(undefined) // User
                .mockReturnValue({
                    value: "0",
                }), // Page
        },
        user: {
            id: "userId",
        }
    } as unknown as CommandInteraction;

    beforeAll(async () => {
        Moon.FetchPaginatedMoonsByUserId = jest.fn().mockResolvedValue([
            [
                {
                    MoonNumber: 1,
                    Description: "Test Description",
                }
            ],
            1,
        ]);

        UserSetting.FetchOneByKey = jest.fn().mockResolvedValue({
            Value: "0",
        });

        await List(interaction);
    });

    test("EXPECT interaction to be replied", () => {
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(repliedWith).toMatchSnapshot();
    });
});

describe("GIVEN moons returned is empty", () => {
    let repliedWith: InteractionReplyOptions | undefined;

    const interaction = {
        reply: jest.fn((options) => {
            repliedWith = options;
        }),
        options: {
            get: jest.fn()
                .mockReturnValueOnce(undefined) // User
                .mockReturnValue({
                    value: "0",
                }), // Page
        },
        user: {
            id: "userId",
        }
    } as unknown as CommandInteraction;

    beforeAll(async () => {
        Moon.FetchPaginatedMoonsByUserId = jest.fn().mockResolvedValue([
            [],
            0,
        ]);

        UserSetting.FetchOneByKey = jest.fn().mockResolvedValue({
            Value: "0",
        });

        await List(interaction);
    });

    test("EXPECT none description", () => {
        expect(repliedWith).toBeDefined();

        expect(repliedWith!.embeds).toBeDefined();
        expect(repliedWith!.embeds!.length).toBe(1);

        const repliedWithEmbed = repliedWith!.embeds![0] as EmbedBuilder;

        expect(repliedWithEmbed.data.description).toBe("*none*");
    });
});

describe("GIVEN it is the first page", () => {
    let repliedWith: InteractionReplyOptions | undefined;

    const interaction = {
        reply: jest.fn((options) => {
            repliedWith = options;
        }),
        options: {
            get: jest.fn()
                .mockReturnValueOnce(undefined) // User
                .mockReturnValue({
                    value: "0",
                }), // Page
        },
        user: {
            id: "userId",
        }
    } as unknown as CommandInteraction;

    beforeAll(async () => {
        Moon.FetchPaginatedMoonsByUserId = jest.fn().mockResolvedValue([
            [
                {
                    MoonNumber: 1,
                    Description: "Test Description",
                }
            ],
            1,
        ]);

        UserSetting.FetchOneByKey = jest.fn().mockResolvedValue({
            Value: "0",
        });

        await List(interaction);
    });

    test("EXPECT Previous button to be disabled", () => {
        expect(repliedWith).toBeDefined();

        expect(repliedWith!.components).toBeDefined();
        expect(repliedWith!.components!.length).toBe(1);

        const repliedWithRow = repliedWith!.components![0] as ActionRowBuilder<ButtonBuilder>;

        expect(repliedWithRow.components[0].data.disabled).toBe(true);
    });
});

describe("GIVEN it is the last page", () => {
    let repliedWith: InteractionReplyOptions | undefined;

    const interaction = {
        reply: jest.fn((options) => {
            repliedWith = options;
        }),
        options: {
            get: jest.fn()
                .mockReturnValueOnce(undefined) // User
                .mockReturnValue({
                    value: "0",
                }), // Page
        },
        user: {
            id: "userId",
        }
    } as unknown as CommandInteraction;

    beforeAll(async () => {
        Moon.FetchPaginatedMoonsByUserId = jest.fn().mockResolvedValue([
            [
                {
                    MoonNumber: 1,
                    Description: "Test Description",
                }
            ],
            1,
        ]);

        UserSetting.FetchOneByKey = jest.fn().mockResolvedValue({
            Value: "0",
        });

        await List(interaction);
    });

    test("EXPECT Next button to be disabled", () => {
        expect(repliedWith).toBeDefined();

        expect(repliedWith!.components).toBeDefined();
        expect(repliedWith!.components!.length).toBe(1);

        const repliedWithRow = repliedWith!.components![0] as ActionRowBuilder<ButtonBuilder>;

        expect(repliedWithRow.components[1].data.disabled).toBe(true);
    });

    describe("GIVEN moon count is greater than the amount of moons in the database", () => {
        beforeAll(async () => {
            UserSetting.FetchOneByKey = jest.fn().mockResolvedValue({
                Value: "2",
            });

            await List(interaction);
        });

        test("EXPECT untracked counter to be shown", () => {
            const repliedWithEmbed = repliedWith!.embeds![0] as EmbedBuilder;

            expect(repliedWithEmbed.data.description).toContain("...plus 1 more untracked");
        });
    });
});

describe("GIVEN moon count is empty", () => {
    let repliedWith: InteractionReplyOptions | undefined;

    const interaction = {
        reply: jest.fn((options) => {
            repliedWith = options;
        }),
        options: {
            get: jest.fn()
                .mockReturnValueOnce(undefined) // User
                .mockReturnValue({
                    value: "0",
                }), // Page
        },
        user: {
            id: "userId",
        }
    } as unknown as CommandInteraction;

    beforeAll(async () => {
        Moon.FetchPaginatedMoonsByUserId = jest.fn().mockResolvedValue([
            [],
            0,
        ]);

        UserSetting.FetchOneByKey = jest.fn().mockResolvedValue({
            Value: "0",
        });

        await List(interaction);
    });

    test("EXPECT Next button to be disabled", () => {
        expect(repliedWith).toBeDefined();

        expect(repliedWith!.components).toBeDefined();
        expect(repliedWith!.components!.length).toBe(1);

        const repliedWithRow = repliedWith!.components![0] as ActionRowBuilder<ButtonBuilder>;

        expect(repliedWithRow.components[1].data.disabled).toBe(true);
    });
});
