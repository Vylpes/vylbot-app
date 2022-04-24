import { Message } from "discord.js";
import Clear from "../../src/commands/clear";
import { ICommandContext } from "../../src/contracts/ICommandContext";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect values to be set', () => {
        process.env = {
            ROLES_MODERATOR: "Moderator"
        };

        const clear = new Clear();

        expect(clear._category).toBe('Moderation');
        expect(clear._roles.length).toBe(1);
        expect(clear._roles[0]).toBe('Moderator');
    });
});

describe('Execute', () => {
    test('Given valid arguments, expect messages to be cleared', async () => {
        const messageChannelSend = jest.fn();
        const messageChannelBulkDelete = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend,
                bulkDelete: messageChannelBulkDelete
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'clear',
            args: ['5'],
            message: message
        };

        const clear = new Clear();
        const result = await clear.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(messageChannelBulkDelete).toBeCalledWith(5);
        expect(result.embeds.length).toBe(1);

        // PublicEmbed
        const publicEmbed = result.embeds[0];

        expect(publicEmbed.title).toBe('');
        expect(publicEmbed.description).toBe('5 message(s) were removed');
    });

    test('Given argument is not given, expect error embed to be sent', async () => {
        const messageChannelSend = jest.fn();
        const messageChannelBulkDelete = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend,
                bulkDelete: messageChannelBulkDelete
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'clear',
            args: [],
            message: message
        };

        const clear = new Clear();
        const result = await clear.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(messageChannelBulkDelete).not.toBeCalled();
        expect(result.embeds.length).toBe(1);

        // ErrorEmbed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.title).toBeNull();
        expect(errorEmbed.description).toBe('Please specify an amount between 1 and 100');
    });

    test('Given argument is not a number, expect error embed to be sent', async () => {
        const messageChannelSend = jest.fn();
        const messageChannelBulkDelete = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend,
                bulkDelete: messageChannelBulkDelete
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'clear',
            args: ['A'],
            message: message
        };

        const clear = new Clear();
        const result = await clear.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(messageChannelBulkDelete).not.toBeCalled();
        expect(result.embeds.length).toBe(1);

        // ErrorEmbed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.title).toBeNull();
        expect(errorEmbed.description).toBe('Please specify an amount between 1 and 100');
    });

    test('Given argument is less than 1, expect error embed to be sent', async () => {
        const messageChannelSend = jest.fn();
        const messageChannelBulkDelete = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend,
                bulkDelete: messageChannelBulkDelete
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'clear',
            args: ['0'],
            message: message
        };

        const clear = new Clear();
        const result = await clear.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(messageChannelBulkDelete).not.toBeCalled();
        expect(result.embeds.length).toBe(1);

        // ErrorEmbed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.title).toBeNull();
        expect(errorEmbed.description).toBe('Please specify an amount between 1 and 100');
    });

    test('Given argument is more than 100, expect error embed to be sent', async () => {
        const messageChannelSend = jest.fn();
        const messageChannelBulkDelete = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend,
                bulkDelete: messageChannelBulkDelete
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'clear',
            args: ['101'],
            message: message
        };

        const clear = new Clear();
        const result = await clear.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(messageChannelBulkDelete).not.toBeCalled();
        expect(result.embeds.length).toBe(1);

        // ErrorEmbed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.title).toBeNull();
        expect(errorEmbed.description).toBe('Please specify an amount between 1 and 100');
    });
});