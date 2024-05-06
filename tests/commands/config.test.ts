import { ChatInputCommandInteraction, CommandInteraction, PermissionsBitField, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "discord.js";
import Command from "../../src/commands/config";
import Server from "../../src/database/entities/Server";
import fs from "fs";
import EmbedColours from "../../src/constants/EmbedColours";
import Setting from "../../src/database/entities/Setting";

beforeEach(() => {
    process.cwd = jest.fn().mockReturnValue("/cwd");
});

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        const command = new Command();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("config");
        expect(commandBuilder.description).toBe("Configure the current server");
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.Administrator.toString());
        expect(commandBuilder.options.length).toBe(4);

        const commandBuilderResetSubcommand = commandBuilder.options[0] as SlashCommandSubcommandBuilder;

        expect(commandBuilderResetSubcommand.name).toBe("reset");
        expect(commandBuilderResetSubcommand.description).toBe("Reset a setting to the default");
        expect(commandBuilderResetSubcommand.options.length).toBe(1);

        const commandBuilderResetSubcommandKeyOption = commandBuilderResetSubcommand.options[0] as SlashCommandStringOption;

        expect(commandBuilderResetSubcommandKeyOption.name).toBe("key");
        expect(commandBuilderResetSubcommandKeyOption.description).toBe("The key");
        expect(commandBuilderResetSubcommandKeyOption.required).toBe(true);

        const commandBuilderGetSubcommand = commandBuilder.options[1] as SlashCommandSubcommandBuilder;

        expect(commandBuilderGetSubcommand.name).toBe("get");
        expect(commandBuilderGetSubcommand.description).toBe("Gets a setting for the server");
        expect(commandBuilderGetSubcommand.options.length).toBe(1);

        const commandBuilderGetSubcommandKeyOption = commandBuilderGetSubcommand.options[0] as SlashCommandStringOption;

        expect(commandBuilderGetSubcommandKeyOption.name).toBe("key");
        expect(commandBuilderGetSubcommandKeyOption.description).toBe("The key");
        expect(commandBuilderGetSubcommandKeyOption.required).toBe(true);

        const commandBuilderSetSubcommand = commandBuilder.options[2] as SlashCommandSubcommandBuilder;

        expect(commandBuilderSetSubcommand.name).toBe("set");
        expect(commandBuilderSetSubcommand.description).toBe("Sets a setting to a specified value");
        expect(commandBuilderSetSubcommand.options.length).toBe(2);

        const commandBuilderSetSubcommandKeyOption = commandBuilderSetSubcommand.options[0] as SlashCommandStringOption;

        expect(commandBuilderSetSubcommandKeyOption.name).toBe("key");
        expect(commandBuilderSetSubcommandKeyOption.description).toBe("The key");
        expect(commandBuilderSetSubcommandKeyOption.required).toBe(true);

        const commandBuilderSetSubcommandValueOption = commandBuilderSetSubcommand.options[1] as SlashCommandStringOption;

        expect(commandBuilderSetSubcommandValueOption.name).toBe("value");
        expect(commandBuilderSetSubcommandValueOption.description).toBe("The value");
        expect(commandBuilderSetSubcommandValueOption.required).toBe(true);

        const commandBuilderListSubcommand = commandBuilder.options[3] as SlashCommandSubcommandBuilder;

        expect(commandBuilderListSubcommand.name).toBe("list");
        expect(commandBuilderListSubcommand.description).toBe("Lists all settings");
    });
});

describe("execute", () => {
    test("GIVEN interaction is not a chat input command, EXPECT nothing to happen", async () => {
        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
            options: {
                getSubcommand: jest.fn(),
            },
        } as unknown as ChatInputCommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.options.getSubcommand).not.toHaveBeenCalled();
    });

    test("GIVEN interaction.guildId is null, EXPECT nothing to happen", async () => {
        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn(),
            },
            guildId: null,
        } as unknown as ChatInputCommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.options.getSubcommand).not.toHaveBeenCalled();
    });

    test("GIVEN server is not set up in the database, EXPECT error", async () => {
        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn(),
            },
            guildId: "guildId",
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        Server.FetchOneById = jest.fn().mockResolvedValue(null);

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(Server.FetchOneById).toHaveBeenCalledTimes(1);
        expect(Server.FetchOneById).toHaveBeenCalledWith(Server, "guildId", [ "Settings" ]);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Server not setup. Please use the setup command.");

        expect(interaction.options.getSubcommand).not.toHaveBeenCalled();
    });

    test("GIVEN subcommand is invalid, EXPECT error", async () => {
        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("invalid"),
            },
            guildId: "guildId",
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        Server.FetchOneById = jest.fn().mockResolvedValue({});

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.options.getSubcommand).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Subcommand not found.");
    });
});

describe("list", () => {
    test("EXPECT help text to be sent", async () => {
        let repliedWith: any;

        // Assert
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            options: {
                getSubcommand: jest.fn().mockReturnValue("list"),
            },
            reply: jest.fn().mockImplementation((options: any) => {
                repliedWith = options.embeds[0];
            }),
        } as unknown as CommandInteraction;

        Server.FetchOneById = jest.fn().mockResolvedValue({});

        const readFileSyncMock = jest.spyOn(fs, "readFileSync").mockReturnValue("Example config text");

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(readFileSyncMock).toHaveBeenCalledTimes(1);
        expect(readFileSyncMock).toHaveBeenCalledWith("/cwd/data/usage/config.txt");

        expect(repliedWith).toBeDefined();
        expect(repliedWith.data.color).toBe(EmbedColours.Ok);
        expect(repliedWith.data.title).toBe("Config");
        expect(repliedWith.data.description).toBe("Example config text");
    });
});

describe("reset", () => {
    test("EXPECT setting value to be set to default", async () => {
        // Assert
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            options: {
                getSubcommand: jest.fn().mockReturnValue("reset"),
                get: jest.fn().mockReturnValue({
                    value: "test.key",
                }),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Server.FetchOneById = jest.fn().mockResolvedValue({
            Settings: [
                {
                    Key: "test.key",
                    Value: "12345",
                },
            ],
        });

        Setting.Remove = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("key");

        expect(Server.FetchOneById).toHaveBeenCalledTimes(1);
        expect(Server.FetchOneById).toHaveBeenCalledWith(Server, "guildId", [ "Settings" ]);

        expect(Setting.Remove).toHaveBeenCalledTimes(1);
        expect(Setting.Remove).toHaveBeenCalledWith(Setting, {
            Key: "test.key",
            Value: "12345",
        });

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("The setting has been reset to the default.");
    });

    test("GIVEN key is null, EXPECT error", async () => {
        // Assert
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            guildId: "guildId",
            options: {
                getSubcommand: jest.fn().mockReturnValue("reset"),
                get: jest.fn().mockReturnValue(null),
            },
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        Server.FetchOneById = jest.fn().mockResolvedValue({
            Settings: [
                {
                    Key: "test.key",
                    Value: "12345",
                },
            ],
        });

        Setting.Remove = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Fields are required.");
    });

    test.todo("GIVEN key.value is undefined, EXPECT error");

    test.todo("GIVEN setting is not found, EXPECT error");
});

describe("get", () => {
    test.todo("EXPECT setting value to be sent");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN key is null, EXPECT error");

    test.todo("GIVEN key.value is undefined, EXPECT error");

    test.todo("GIVEN server can not be found in database, EXPECT error");

    test.todo("GIVEN setting can not be found AND a default value is found, EXPECT default to be shown");

    test.todo("GIVEN setting can not be found AND a default value is not found, EXPECT none to be shown");
});

describe("set", () => {
    test.todo("GIVEN setting already is set, EXPECT setting to be updated");

    test.todo("GIVEN setting is not set, EXPECT setting to be added");

    test.todo("GIVEN interaction.guildId is null, EXPECT nothing to happen");

    test.todo("GIVEN key is null, EXPECT error");

    test.todo("GIVEN key.value is undefined, EXPECT error");

    test.todo("GIVEN value is null, EXPECT error");

    test.todo("GIVEN value.value is undefined, EXPECT error");

    test.todo("GIVEN server can not be found in the database, EXPECT error");
});