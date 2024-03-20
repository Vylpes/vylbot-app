import { ChatInputCommandInteraction } from 'discord.js';
import ChatInputComamnd from '../../../src/client/interactionCreate/chatInputCommand';
import { CoreClient } from '../../../src/client/client';
import ICommandItem from '../../../src/contracts/ICommandItem';

beforeEach(() => {
    CoreClient.commandItems = [];
});

describe('onChatInput', () => {
    test("GIVEN command is registered globally AND command is found, execute the global command", async () => {
        // Arrange
        const interaction = {
            reply: jest.fn(),
            isChatInputCommand: jest.fn().mockReturnValue(true),
            commandName: "test",
        } as unknown as ChatInputCommandInteraction;

        const testCommand: ICommandItem = {
            Name: "test",
            Command: {
                CommandBuilder: jest.fn(),
                execute: jest.fn(),
            },
        };

        const testServerCommand: ICommandItem = {
            Name: "test",
            Command: {
                CommandBuilder: jest.fn(),
                execute: jest.fn(),
            },
            ServerId: "123",
        };

        CoreClient.commandItems = [ testCommand, testServerCommand ];

        // Act
        await ChatInputComamnd.onChatInput(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.reply).not.toHaveBeenCalled();

        expect(testCommand.Command.execute).toHaveBeenCalledTimes(1);
        expect(testCommand.Command.execute).toHaveBeenCalledWith(interaction);
        expect(testServerCommand.Command.execute).not.toHaveBeenCalled();
    });

    test("GIVEN command is registered to a single server, execute the server command", async () => {
        // Arrange
        const interaction = {
            reply: jest.fn(),
            isChatInputCommand: jest.fn().mockReturnValue(true),
            commandName: "test",
            guildId: "123",
        } as unknown as ChatInputCommandInteraction;

        const testCommand: ICommandItem = {
            Name: "test",
            Command: {
                CommandBuilder: jest.fn(),
                execute: jest.fn(),
            },
        };

        const testServerCommand: ICommandItem = {
            Name: "test",
            Command: {
                CommandBuilder: jest.fn(),
                execute: jest.fn(),
            },
            ServerId: "123",
        };

        CoreClient.commandItems = [ testCommand, testServerCommand ];

        // Act
        await ChatInputComamnd.onChatInput(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.reply).not.toHaveBeenCalled();

        expect(testServerCommand.Command.execute).toHaveBeenCalledTimes(1);
        expect(testServerCommand.Command.execute).toHaveBeenCalledWith(interaction);
        expect(testCommand.Command.execute).not.toHaveBeenCalled();
    });

    test("GIVEN interaction is not a chat input command, EXPECT nothing to happen", async () => {
        // Arrange
        const interaction = {
            reply: jest.fn(),
            isChatInputCommand: jest.fn().mockReturnValue(false),
            commandName: "test",
            guildId: "123",
        } as unknown as ChatInputCommandInteraction;

        const testCommand: ICommandItem = {
            Name: "test",
            Command: {
                CommandBuilder: jest.fn(),
                execute: jest.fn(),
            },
        };

        const testServerCommand: ICommandItem = {
            Name: "test",
            Command: {
                CommandBuilder: jest.fn(),
                execute: jest.fn(),
            },
            ServerId: "123",
        };

        CoreClient.commandItems = [ testCommand, testServerCommand ];

        // Act
        await ChatInputComamnd.onChatInput(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.reply).not.toHaveBeenCalled();

        expect(testServerCommand.Command.execute).not.toHaveBeenCalled();
        expect(testCommand.Command.execute).not.toHaveBeenCalled();
    });

    test("GIVEN command is registered globally AND command is not found, EXPECT error", async () => {
        // Arrange
        const interaction = {
            reply: jest.fn(),
            isChatInputCommand: jest.fn().mockReturnValue(true),
            commandName: "other",
            guildId: "123",
        } as unknown as ChatInputCommandInteraction;

        const testCommand: ICommandItem = {
            Name: "test",
            Command: {
                CommandBuilder: jest.fn(),
                execute: jest.fn(),
            },
        };

        const testServerCommand: ICommandItem = {
            Name: "test",
            Command: {
                CommandBuilder: jest.fn(),
                execute: jest.fn(),
            },
            ServerId: "123",
        };

        CoreClient.commandItems = [ testCommand, testServerCommand ];

        // Act
        await ChatInputComamnd.onChatInput(interaction);

        // Assert
        expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Command not found.");

        expect(testServerCommand.Command.execute).not.toHaveBeenCalled();
        expect(testCommand.Command.execute).not.toHaveBeenCalled();
    });
});