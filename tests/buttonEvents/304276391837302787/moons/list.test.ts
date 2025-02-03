import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder} from "discord.js";
import List from "../../../../src/buttonEvents/304276391837302787/moons/list";
import UserSetting from "../../../../src/database/entities/UserSetting";
import Moon from "../../../../src/database/entities/304276391837302787/Moon";

describe("GIVEN happy flow", () => {
    let updatedWithEmbeds: EmbedBuilder[] | undefined;
    let updatedWithRows: ActionRowBuilder<ButtonBuilder>[] | undefined;

    const interaction = {
        guild: {
            members: {
                cache: {
                    find: jest.fn().mockReturnValue({
                        user: {
                            username: "username",
                        },
                    }),
                },
            },
        },
        reply: jest.fn(),
        update: jest.fn((options: any) => {
            updatedWithEmbeds = options.embeds;
            updatedWithRows = options.components;
        }),
        customId: "moons list userId 0",
    } as unknown as ButtonInteraction;

    beforeAll(async () => {
        UserSetting.FetchOneByKey = jest.fn();
        Moon.FetchPaginatedMoonsByUserId = jest.fn().mockResolvedValue([
            [
                {
                    MoonNumber: 1,
                    Description: "Test Description",
                }
            ],
            1,
        ]);

        await List(interaction);
    });

    test("EXPECT moons to be fetched", () => {
        expect(Moon.FetchPaginatedMoonsByUserId).toHaveBeenCalledTimes(1);
        expect(Moon.FetchPaginatedMoonsByUserId).toHaveBeenCalledWith("userId", 10, 0);
    });

    test("EXPECT interaction.update to be called", () => {
        expect(interaction.update).toHaveBeenCalledTimes(1);
    });

    test("EXPECT embed to be updated", () => {
        expect(updatedWithEmbeds).toMatchSnapshot();
    });

    test("EXPECT row to be updated", () => {
        expect(updatedWithRows).toMatchSnapshot();
    });
});

describe("GIVEN interaction.guild is null", () => {
    const interaction = {
        guild: null,
        reply: jest.fn(),
        update: jest.fn(),
    } as unknown as ButtonInteraction;

    beforeAll(async () => {
        UserSetting.FetchOneByKey = jest.fn();

        await List(interaction);
    });

    test("EXPECT function to return", () => {
        expect(interaction.reply).not.toHaveBeenCalled();
        expect(interaction.update).not.toHaveBeenCalled();
        expect(UserSetting.FetchOneByKey).not.toHaveBeenCalled();
    });
});

describe("GIVEN userId parameter is undefined", () => {
    const interaction = {
        guild: {},
        reply: jest.fn(),
        update: jest.fn(),
        customId: "moons list",
    } as unknown as ButtonInteraction;

    beforeAll(async () => {
        UserSetting.FetchOneByKey = jest.fn();

        await List(interaction);
    });

    test("EXPECT function to return", () => {
        expect(interaction.reply).not.toHaveBeenCalled();
        expect(interaction.update).not.toHaveBeenCalled();
        expect(UserSetting.FetchOneByKey).not.toHaveBeenCalled();
    });
});

describe("GIVEN page parameter is undefined", () => {
    const interaction = {
        guild: {},
        reply: jest.fn(),
        update: jest.fn(),
        customId: "moons list userId",
    } as unknown as ButtonInteraction;

    beforeAll(async () => {
        UserSetting.FetchOneByKey = jest.fn();

        await List(interaction);
    });

    test("EXPECT function to return", () => {
        expect(interaction.reply).not.toHaveBeenCalled();
        expect(interaction.update).not.toHaveBeenCalled();
        expect(UserSetting.FetchOneByKey).not.toHaveBeenCalled();
    });
});

describe("GIVEN no moons for the user is returned", () => {
    const interaction = {
        guild: {
            members: {
                cache: {
                    find: jest.fn().mockReturnValue({
                        user: {
                            username: "username",
                        },
                    }),
                },
            },
        },
        reply: jest.fn(),
        update: jest.fn(),
        customId: "moons list userId 0",
    } as unknown as ButtonInteraction;

    beforeAll(async () => {
        UserSetting.FetchOneByKey = jest.fn();
        Moon.FetchPaginatedMoonsByUserId = jest.fn().mockResolvedValue(undefined)

        await List(interaction);
    });

    test("EXPECT moons function to be called", () => {
        expect(Moon.FetchPaginatedMoonsByUserId).toHaveBeenCalledTimes(1);
    });

    test("EXPECT error replied", () => {
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("username does not have any moons or page is invalid.");
    });

    describe("GIVEN member is not in cache", () => {
        const interaction = {
            guild: {
                members: {
                    cache: {
                        find: jest.fn().mockReturnValue(undefined),
                    },
                    fetch: jest.fn().mockResolvedValue({
                        user: {
                            username: "username",
                        },
                    }),
                },
            },
            reply: jest.fn(),
            update: jest.fn(),
            customId: "moons list userId 0",
        } as unknown as ButtonInteraction;

        beforeAll(async () => {
            UserSetting.FetchOneByKey = jest.fn();
            Moon.FetchPaginatedMoonsByUserId = jest.fn().mockResolvedValue(undefined)

            await List(interaction);
        });

        test("EXPECT API to be called", () => {
            expect(interaction.guild?.members.fetch).toHaveBeenCalledTimes(1);
            expect(interaction.guild?.members.fetch).toHaveBeenCalledWith("userId");
        });

        test("EXPECT error replied with username", () => {
            expect(interaction.reply).toHaveBeenCalledTimes(1);
            expect(interaction.reply).toHaveBeenCalledWith("username does not have any moons or page is invalid.");
        });
    });

    describe("GIVEN member can not be found", () => {
        const interaction = {
            guild: {
                members: {
                    cache: {
                        find: jest.fn().mockReturnValue(undefined),
                    },
                    fetch: jest.fn().mockResolvedValue(undefined),
                },
            },
            reply: jest.fn(),
            update: jest.fn(),
            customId: "moons list userId 0",
        } as unknown as ButtonInteraction;

        beforeAll(async () => {
            UserSetting.FetchOneByKey = jest.fn();
            Moon.FetchPaginatedMoonsByUserId = jest.fn().mockResolvedValue(undefined)

            await List(interaction);
        });

        test("EXPECT API to be called", () => {
            expect(interaction.guild?.members.fetch).toHaveBeenCalledTimes(1);
            expect(interaction.guild?.members.fetch).toHaveBeenCalledWith("userId");
        });

        test("EXPECT error replied with username", () => {
            expect(interaction.reply).toHaveBeenCalledTimes(1);
            expect(interaction.reply).toHaveBeenCalledWith("This user does not have any moons or page is invalid.");
        });
    });
});

describe("GIVEN no moons on current page", () => {
    let updatedWith: EmbedBuilder[] | undefined;

    const interaction = {
        guild: {
            members: {
                cache: {
                    find: jest.fn().mockReturnValue({
                        user: {
                            username: "username",
                        },
                    }),
                },
            },
        },
        reply: jest.fn(),
        update: jest.fn((options: any) => {
            updatedWith = options.embeds;
        }),
        customId: "moons list userId 0",
    } as unknown as ButtonInteraction;

    beforeAll(async () => {
        UserSetting.FetchOneByKey = jest.fn();
        Moon.FetchPaginatedMoonsByUserId = jest.fn().mockResolvedValue([
            [],
            0,
        ]);

        await List(interaction);
    });

    test("EXPECT description to say so", () => {
        expect(updatedWith).toBeDefined();
        expect(updatedWith?.length).toBe(1);

        expect(updatedWith![0].data.description).toBe("*none*");
    });
});