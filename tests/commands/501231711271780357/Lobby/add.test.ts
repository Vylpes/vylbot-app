import { CommandInteraction, PermissionsBitField, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandStringOption } from "discord.js";
import Add from "../../../../src/commands/501231711271780357/Lobby/add";
import Lobby from "../../../../src/database/entities/501231711271780357/Lobby";

describe('constuctor', () => {
    test("EXPECT properties to be set", () => {
        const add = new Add();

        expect(add.CommandBuilder).toBeDefined();

        const commandbuilder = add.CommandBuilder as SlashCommandBuilder;

        expect(commandbuilder.name).toBe("addlobby");
        expect(commandbuilder.description).toBe("Add lobby channel");
        expect(commandbuilder.default_member_permissions).toBe(PermissionsBitField.Flags.ModerateMembers.toString());

        expect(commandbuilder.options.length).toBe(4);

        const channelOption = commandbuilder.options[0] as SlashCommandChannelOption;

        expect(channelOption.name).toBe("channel");
        expect(channelOption.description).toBe("The channel");
        expect(channelOption.required).toBe(true);

        const roleOption = commandbuilder.options[1] as SlashCommandRoleOption;

        expect(roleOption.name).toBe("role");
        expect(roleOption.description).toBe("The role to ping on request");
        expect(roleOption.required).toBe(true);

        const cooldownOption = commandbuilder.options[2] as SlashCommandNumberOption;

        expect(cooldownOption.name).toBe("cooldown");
        expect(cooldownOption.description).toBe("The cooldown in minutes");
        expect(cooldownOption.required).toBe(true);

        const nameOption = commandbuilder.options[3] as SlashCommandStringOption;

        expect(nameOption.name).toBe("name");
        expect(nameOption.description).toBe("The game name");
        expect(nameOption.required).toBe(true);
    });
});

describe('execute', () => {
    test("EXPECT channel to be added to the lobby database table", async () => {
        const channel = {
            channel: {
                id: "channelId",
            },
            name: "channelName",
        };
        const role = {
            role: {},
            name: "roleName",
        };
        const cooldown = {
            value: "5",
        };
        const gameName = {
            value: "test",
        };

        const interaction = {
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(channel)
                    .mockReturnValueOnce(role)
                    .mockReturnValueOnce(cooldown)
                    .mockReturnValueOnce(gameName),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Lobby.FetchOneByChannelId = jest.fn().mockReturnValue(null);
        Lobby.prototype.Save = jest.fn();

        const add = new Add();
        await add.execute(interaction);

        expect(interaction.options.get).toHaveBeenCalledTimes(4);
        expect(interaction.options.get).toHaveBeenCalledWith("channel");
        expect(interaction.options.get).toHaveBeenCalledWith("role");
        expect(interaction.options.get).toHaveBeenCalledWith("cooldown");
        expect(interaction.options.get).toHaveBeenCalledWith("name");

        expect(Lobby.FetchOneByChannelId).toHaveBeenCalledTimes(1);
        expect(Lobby.FetchOneByChannelId).toHaveBeenCalledWith("channelId");

        expect(Lobby.prototype.Save).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Added `channelName` as a new lobby channel with a cooldown of `5 minutes` and will ping `roleName` on use");
    });

    test("GIVEN channel is null, EXPECT error", async () => {
        const channel = null;
        const role = {
            role: {},
            name: "roleName",
        };
        const cooldown = {
            value: "5",
        };
        const gameName = {
            value: "test",
        };

        const interaction = {
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(channel)
                    .mockReturnValueOnce(role)
                    .mockReturnValueOnce(cooldown)
                    .mockReturnValueOnce(gameName),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const add = new Add();
        await add.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN channel.channel is undefined, EXPECT error", async () => {
        const channel = {
            channel: undefined,
        };
        const role = {
            role: {},
            name: "roleName",
        };
        const cooldown = {
            value: "5",
        };
        const gameName = {
            value: "test",
        };

        const interaction = {
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(channel)
                    .mockReturnValueOnce(role)
                    .mockReturnValueOnce(cooldown)
                    .mockReturnValueOnce(gameName),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const add = new Add();
        await add.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN role is null, EXPECT error", async () => {
        const channel = {
            channel: {},
        };
        const role = null;
        const cooldown = {
            value: "5",
        };
        const gameName = {
            value: "test",
        };

        const interaction = {
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(channel)
                    .mockReturnValueOnce(role)
                    .mockReturnValueOnce(cooldown)
                    .mockReturnValueOnce(gameName),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const add = new Add();
        await add.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN role.role is undefined, EXPECT error", async () => {
        const channel = {
            channel: {},
        };
        const role = {
            role: undefined
        };
        const cooldown = {
            value: "5",
        };
        const gameName = {
            value: "test",
        };

        const interaction = {
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(channel)
                    .mockReturnValueOnce(role)
                    .mockReturnValueOnce(cooldown)
                    .mockReturnValueOnce(gameName),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const add = new Add();
        await add.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN cooldown is null, EXPECT error", async () => {
        const channel = {
            channel: {},
        };
        const role = {
            role: {},
            name: "roleName",
        };
        const cooldown = null;
        const gameName = {
            value: "test",
        };

        const interaction = {
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(channel)
                    .mockReturnValueOnce(role)
                    .mockReturnValueOnce(cooldown)
                    .mockReturnValueOnce(gameName),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const add = new Add();
        await add.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN cooldown.value is undefined, EXPECT error", async () => {
        const channel = {
            channel: {},
        };
        const role = {
            role: {},
            name: "roleName",
        };
        const cooldown = {
            value: undefined,
        };
        const gameName = {
            value: "test",
        };

        const interaction = {
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(channel)
                    .mockReturnValueOnce(role)
                    .mockReturnValueOnce(cooldown)
                    .mockReturnValueOnce(gameName),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const add = new Add();
        await add.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN gameName is null, EXPECT error", async () => {
        const channel = {
            channel: {},
        };
        const role = {
            role: {},
            name: "roleName",
        };
        const cooldown = {
            value: "5",
        };
        const gameName = null;

        const interaction = {
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(channel)
                    .mockReturnValueOnce(role)
                    .mockReturnValueOnce(cooldown)
                    .mockReturnValueOnce(gameName),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const add = new Add();
        await add.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN gameName.value is undefined, EXPECT error", async () => {
        const channel = {
            channel: {},
        };
        const role = {
            role: {},
            name: "roleName",
        };
        const cooldown = {
            value: "5",
        };
        const gameName = {
            value: undefined,
        };

        const interaction = {
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(channel)
                    .mockReturnValueOnce(role)
                    .mockReturnValueOnce(cooldown)
                    .mockReturnValueOnce(gameName),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const add = new Add();
        await add.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test("GIVEN channel has already been set up in the database, EXPECT error", async () => {
        const channel = {
            channel: {
                id: "channelId",
            },
            name: "channelName",
        };
        const role = {
            role: {},
            name: "roleName",
        };
        const cooldown = {
            value: "5",
        };
        const gameName = {
            value: "test",
        };

        const interaction = {
            options: {
                get: jest.fn()
                    .mockReturnValueOnce(channel)
                    .mockReturnValueOnce(role)
                    .mockReturnValueOnce(cooldown)
                    .mockReturnValueOnce(gameName),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Lobby.FetchOneByChannelId = jest.fn().mockReturnValue({});
        Lobby.prototype.Save = jest.fn();

        const add = new Add();
        await add.execute(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("This channel has already been setup.");

        expect(Lobby.FetchOneByChannelId).toHaveBeenCalledTimes(1);
        expect(Lobby.prototype.Save).not.toHaveBeenCalled();
    });
});