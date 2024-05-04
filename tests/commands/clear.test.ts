import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, SlashCommandNumberOption, TextChannel } from "discord.js";
import Command from "../../src/commands/clear";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test("EXPECT values to be set", () => {
        const command = new Command();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("clear");
        expect(commandBuilder.description).toBe("Clears the channel of messages");
        expect(commandBuilder.default_member_permissions).toBe(PermissionsBitField.Flags.ManageMessages.toString());
        expect(commandBuilder.options.length).toBe(1);

        const commandBuilderCountOption = commandBuilder.options[0] as SlashCommandNumberOption;

        expect(commandBuilderCountOption.name).toBe("count");
        expect(commandBuilderCountOption.description).toBe("The amount to delete");
        expect(commandBuilderCountOption.required).toBe(true);
        expect(commandBuilderCountOption.min_value).toBe(1);
        expect(commandBuilderCountOption.max_value).toBe(100);
    });
});

describe('Execute', () => {
    test("GIVEN input is valid, EXPECT messages to be cleared", async () => {
        // Arrange
        const channel = {
            manageable: true,
            bulkDelete: jest.fn(),
        } as unknown as TextChannel;

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            channel: channel,
            options: {
                getNumber: jest.fn().mockReturnValue(50),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);

        expect(interaction.options.getNumber).toHaveBeenCalledTimes(1);
        expect(interaction.options.getNumber).toHaveBeenCalledWith("count");

        expect(channel.bulkDelete).toHaveBeenCalledTimes(1);
        expect(channel.bulkDelete).toHaveBeenCalledWith(50);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("50 message(s) were removed.");
    });

    test("GIVEN interaction is NOT a chat input command, EXPECT nothing to happen", async () => {
        // Arrange
        const channel = {
            manageable: true,
            bulkDelete: jest.fn(),
        } as unknown as TextChannel;

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
            channel: channel,
            options: {
                getNumber: jest.fn().mockReturnValue(50),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).not.toHaveBeenCalled();
        expect(channel.bulkDelete).not.toHaveBeenCalled();
    });

    test("GIVEN interaction.channel is null, EXPECT nothing to happen", async () => {
        // Arrange
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            channel: null,
            options: {
                getNumber: jest.fn().mockReturnValue(50),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN totalClear input is NOT supplied, EXPECT invalid error", async () => {
        // Arrange
        const channel = {
            manageable: true,
            bulkDelete: jest.fn(),
        } as unknown as TextChannel;

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            channel: channel,
            options: {
                getNumber: jest.fn().mockReturnValue(null),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Please specify an amount between 1 and 100.");

        expect(channel.bulkDelete).not.toHaveBeenCalled();
    });

    test("GIVEN totalClear is less than or equal to 0, EXPECT invalid error", async () => {
        // Arrange
        const channel = {
            manageable: true,
            bulkDelete: jest.fn(),
        } as unknown as TextChannel;

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            channel: channel,
            options: {
                getNumber: jest.fn().mockReturnValue(0),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Please specify an amount between 1 and 100.");

        expect(channel.bulkDelete).not.toHaveBeenCalled();
    });

    test("GIVEN totalClear is greater than 100, EXPECT invalid error", async () => {
        // Arrange
        const channel = {
            manageable: true,
            bulkDelete: jest.fn(),
        } as unknown as TextChannel;

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            channel: channel,
            options: {
                getNumber: jest.fn().mockReturnValue(101),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Please specify an amount between 1 and 100.");

        expect(channel.bulkDelete).not.toHaveBeenCalled();
    });

    test("GIVEN channel is NOT manageable, EXPECT insufficient permissions error", async () => {
        // Arrange
        const channel = {
            manageable: false,
            bulkDelete: jest.fn(),
        } as unknown as TextChannel;

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            channel: channel,
            options: {
                getNumber: jest.fn().mockReturnValue(50),
            },
            reply: jest.fn(),
        } as unknown as ChatInputCommandInteraction;

        // Act
        const command = new Command();
        await command.execute(interaction);

        // Assert
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Insufficient permissions. Please contact a moderator.");

        expect(channel.bulkDelete).not.toHaveBeenCalled();
    });
});