import { APIEmbed, APIVersion, ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import Command from "../../src/commands/code";
import StringTools from "../../src/helpers/StringTools";
import SettingsHelper from "../../src/helpers/SettingsHelper";

describe('constructor', () => {
    test("EXPECT properties to be set", () => {
        const command = new Command();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("code");
        expect(commandBuilder.description).toBe("Manage the verification code of the server");
        expect(commandBuilder.options.length).toBe(2);

        const commandBuilderRandomiseSubcommand = commandBuilder.options[0] as SlashCommandSubcommandBuilder;

        expect(commandBuilderRandomiseSubcommand.name).toBe("randomise");
        expect(commandBuilderRandomiseSubcommand.description).toBe("Regenerates the verification code for this server");

        const commandBuilderEmbedSubcommand = commandBuilder.options[1] as SlashCommandSubcommandBuilder;

        expect(commandBuilderEmbedSubcommand.name).toBe("embed");
        expect(commandBuilderEmbedSubcommand.description).toBe("Sends the embed with the current code to the current channel");
    });
});

describe("execute", () => {
    test("GIVEN interaction is not a chat input command, EXPECT nothing to happen", async () => {
        // Assert
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.reply).not.toHaveBeenCalled();
    });
});

describe("randomise", () => {
    test("EXPECT entry code to be randomised", async () => {
        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("randomise"),
            },
            reply: jest.fn(),
            guildId: "guildId",
        } as unknown as ChatInputCommandInteraction;

        StringTools.RandomString = jest.fn().mockReturnValue("12345");

        SettingsHelper.SetSetting = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.options.getSubcommand).toHaveBeenCalledTimes(1);

        expect(StringTools.RandomString).toHaveBeenCalledTimes(1);
        expect(StringTools.RandomString).toHaveBeenCalledWith(5);

        expect(SettingsHelper.SetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.SetSetting).toHaveBeenCalledWith("verification.code", "guildId", "12345");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Entry code has been set to `12345`");
    });

    test("GIVEN interaction.guildId is null, EXPECT nothing to happen", async () => {
        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("randomise"),
            },
            reply: jest.fn(),
            guildId: null,
        } as unknown as ChatInputCommandInteraction;

        StringTools.RandomString = jest.fn().mockReturnValue("12345");

        SettingsHelper.SetSetting = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).not.toHaveBeenCalled();
        expect(SettingsHelper.SetSetting).not.toHaveBeenCalled();
        expect(StringTools.RandomString).not.toHaveBeenCalled();
    });
});

describe("embed", () => {
    test("EXPECT embed to be sent", async () => {
        let repliedWithEmbed: any;

        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("embed"),
            },
            reply: jest.fn(),
            guildId: "guildId",
            channel: {
                send: jest.fn().mockImplementation((options: any) => {
                    repliedWithEmbed = options.embeds[0];
                }),
            },
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("12345");

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.options.getSubcommand).toHaveBeenCalledTimes(1);

        expect(SettingsHelper.GetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("verification.code", "guildId");

        expect(interaction.channel!.send).toHaveBeenCalledTimes(1);
        
        expect(repliedWithEmbed).toBeDefined();
        expect(repliedWithEmbed.data.title).toBe("Entry Code");
        expect(repliedWithEmbed.data.description).toBe("12345");
    });

    test("GIVEN interaction.guildId is null, EXPECT nothing to happen", async () => {
        let repliedWithEmbed: any;

        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("embed"),
            },
            reply: jest.fn(),
            guildId: null,
            channel: {
                send: jest.fn().mockImplementation((options: any) => {
                    repliedWithEmbed = options.embeds[0];
                }),
            },
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("12345");

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.channel!.send).not.toHaveBeenCalled();
        expect(SettingsHelper.GetSetting).not.toHaveBeenCalled();

        expect(repliedWithEmbed).toBeUndefined();
    });

    test("GIVEN interaction.channel is null, EXPECT nothing to happen", async () => {
        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("embed"),
            },
            reply: jest.fn(),
            guildId: "guildId",
            channel: null,
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("12345");

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(SettingsHelper.GetSetting).not.toHaveBeenCalled();
    });

    test("GIVEN verification.code setting is undefined, EXPECT error", async () => {
        let repliedWithEmbed: any;

        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("embed"),
            },
            reply: jest.fn(),
            guildId: "guildId",
            channel: {
                send: jest.fn().mockImplementation((options: any) => {
                    repliedWithEmbed = options.embeds[0];
                }),
            },
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue(undefined);

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("There is no code for this server setup.");

        expect(interaction.channel! .send).not.toHaveBeenCalled();
    });

    test("GIVEN verification.code setting is empty, EXPECT error", async () => {
        let repliedWithEmbed: any;

        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("embed"),
            },
            reply: jest.fn(),
            guildId: "guildId",
            channel: {
                send: jest.fn().mockImplementation((options: any) => {
                    repliedWithEmbed = options.embeds[0];
                }),
            },
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("");

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("There is no code for this server setup.");

        expect(interaction.channel!.send).not.toHaveBeenCalled();
    });
});