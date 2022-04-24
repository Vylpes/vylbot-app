import { Message } from "discord.js";
import { ICommandContext } from "../../../src/contracts/ICommandContext";
import ErrorEmbed from "../../../src/helpers/embeds/ErrorEmbed";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect properties to be set', () => {
        process.env = {
            EMBED_COLOUR_ERROR: '0xd52803'
        }

        const message = {} as unknown as Message;

        const context: ICommandContext = {
            name: 'command',
            args: [],
            message: message
        };

        const errorEmbed = new ErrorEmbed(context, 'Error Message');

        expect(errorEmbed.color?.toString()).toBe('13969411'); // 0xd52803 in decimal
        expect(errorEmbed.description).toBe('Error Message');
        expect(errorEmbed.context).toBe(context);
    });
});

describe('SendToCurrentChannel', () => {
    test('Expect embed to be sent to the current channel in context', () => {
        process.env = {
            EMBED_COLOUR_ERROR: '0xd52803'
        }

        const messageChannelSend = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'command',
            args: [],
            message: message
        };

        const errorEmbed = new ErrorEmbed(context, 'Error Message');

        errorEmbed.SendToCurrentChannel();

        expect(messageChannelSend).toBeCalledWith(errorEmbed);
    });
});