import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "discord.js";
import Command from "../../src/commands/disable";
import SettingsHelper from "../../src/helpers/SettingsHelper";

describe('constructor', () => {
    test('EXPECT properties to be set', () => {
        const command = new Command();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("disable");
        expect(commandBuilder.description).toBe("Disables a command");
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.Administrator.toString());
        expect(commandBuilder.options.length).toBe(2);

        const commandBuilderAddSubcommand = commandBuilder.options[0] as SlashCommandSubcommandBuilder;

        expect(commandBuilderAddSubcommand.name).toBe("add");
        expect(commandBuilderAddSubcommand.description).toBe("Disables a command for the server");
        expect(commandBuilderAddSubcommand.options.length).toBe(1);

        const commandBuilderAddSubcommandNameOption = commandBuilderAddSubcommand.options[0] as SlashCommandStringOption;

        expect(commandBuilderAddSubcommandNameOption.name).toBe("name");
        expect(commandBuilderAddSubcommandNameOption.description).toBe("The name of the command");
        expect(commandBuilderAddSubcommandNameOption.required).toBe(true);

        const commandBuilderRemoveSubcommand = commandBuilder.options[1] as SlashCommandSubcommandBuilder;

        expect(commandBuilderRemoveSubcommand.name).toBe("remove");
        expect(commandBuilderRemoveSubcommand.description).toBe("Enables a command for the server");
        expect(commandBuilderRemoveSubcommand.options.length).toBe(1);

        const commandBuilderRemoveSubcommandNameOption = commandBuilderRemoveSubcommand.options[0] as SlashCommandStringOption;

        expect(commandBuilderRemoveSubcommandNameOption.name).toBe("name");
        expect(commandBuilderRemoveSubcommandNameOption.description).toBe("The name of the command");
        expect(commandBuilderRemoveSubcommandNameOption.required).toBe(true);
    });
});

describe('execute', () => {
    test("GIVEN interaction is not a chat input command, EXPECT nothing to happen", async () => {
        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN subcommand is invalid, EXPECT error", async () => {
        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("invalid"),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.options.getSubcommand).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Subcommand not found.");
    });
});

describe('add', () => {
    test("EXPECT command to be added to disabled list", async () => {
        // Arrange
        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("add"),
                get: jest.fn().mockReturnValue({
                    value: "testCommand",
                }),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("otherCommand");
        SettingsHelper.SetSetting = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("name", true);

        expect(SettingsHelper.GetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("commands.disabled", "guildId");

        expect(SettingsHelper.SetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.SetSetting).toHaveBeenCalledWith("commands.disabled", "guildId", "otherCommand,testCommand");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Disabled command testCommand");
    });

    test("GIVEN interaction.guildId is null, EXPECT nothing to happen", async () => {
        // Arrange
        const interaction = {
            guildId: null,
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("add"),
                get: jest.fn().mockReturnValue({
                    value: "testCommand",
                }),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("otherCommand");
        SettingsHelper.SetSetting = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).not.toHaveBeenCalled();
        expect(SettingsHelper.SetSetting).not.toHaveBeenCalled();
    });

    test("GIVEN disabledCommandsString is undefined, EXPECT empty disabledCommands array to be used", async () => {
        // Arrange
        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("add"),
                get: jest.fn().mockReturnValue({
                    value: "testCommand",
                }),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue(undefined);
        SettingsHelper.SetSetting = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(SettingsHelper.SetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.SetSetting).toHaveBeenCalledWith("commands.disabled", "guildId", "testCommand");
    });
});

describe("remove", () => {
    test("EXPECT command to be removed from disabled list", async () => {
        // Arrange
        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("remove"),
                get: jest.fn().mockReturnValue({
                    value: "testCommand",
                }),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("otherCommand,testCommand");
        SettingsHelper.SetSetting = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.options.get).toHaveBeenCalledTimes(1);
        expect(interaction.options.get).toHaveBeenCalledWith("name", true);

        expect(SettingsHelper.GetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.GetSetting).toHaveBeenCalledWith("commands.disabled", "guildId");

        expect(SettingsHelper.SetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.SetSetting).toHaveBeenCalledWith("commands.disabled", "guildId", "otherCommand");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Enabled command testCommand");
    });

    test("GIVEN interaction.guildId is null, EXPECT nothing to happen", async () => {
        // Arrange
        const interaction = {
            guildId: null,
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("remove"),
                get: jest.fn().mockReturnValue({
                    value: "testCommand",
                }),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("otherCommand,testCommand");
        SettingsHelper.SetSetting = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).not.toHaveBeenCalled();
        expect(SettingsHelper.SetSetting).not.toHaveBeenCalled();
    });

    test("GIVEN disabledCommandsString is undefined, EXPECT empty disabledCommands array to be used", async () => {
        // Arrange
        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("remove"),
                get: jest.fn().mockReturnValue({
                    value: "testCommand",
                }),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue(undefined);
        SettingsHelper.SetSetting = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(SettingsHelper.SetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.SetSetting).toHaveBeenCalledWith("commands.disabled", "guildId", "");
    });

    test("GIVEN instance of commandName is not found in disabledCommands array, EXPECT it not to try to remove it", async () => {
        // Arrange
        const interaction = {
            guildId: "guildId",
            isChatInputCommand: jest.fn().mockReturnValue(true),
            options: {
                getSubcommand: jest.fn().mockReturnValue("remove"),
                get: jest.fn().mockReturnValue({
                    value: "testCommand",
                }),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        SettingsHelper.GetSetting = jest.fn().mockResolvedValue("otherCommand");
        SettingsHelper.SetSetting = jest.fn();

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(SettingsHelper.SetSetting).toHaveBeenCalledTimes(1);
        expect(SettingsHelper.SetSetting).toHaveBeenCalledWith("commands.disabled", "guildId", "otherCommand");
    });
});