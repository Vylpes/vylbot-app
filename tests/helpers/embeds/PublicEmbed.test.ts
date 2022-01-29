import { Guild, Message, TextChannel, User } from "discord.js";
import { ICommandContext } from "../../../src/contracts/ICommandContext";
import PublicEmbed from "../../../src/helpers/embeds/PublicEmbed";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect properties to be set', () => {
        process.env = {
            EMBED_COLOUR: '0xd52803',
            CHANNELS_LOGS_MESSAGE: 'message-logs',
            CHANNELS_LOGS_MEMBER: 'member-logs',
            CHANNELS_LOGS_MOD: 'mod-logs'
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

        const errorEmbed = new PublicEmbed(context, 'Log Message', 'Log Description');

        expect(errorEmbed.color?.toString()).toBe('13969411'); // 0xd52803 in decimal
        expect(errorEmbed.title).toBe('Log Message');
        expect(errorEmbed.description).toBe('Log Description');
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

        const errorEmbed = new PublicEmbed(context, 'Message', 'Description');

        errorEmbed.SendToCurrentChannel();

        expect(messageChannelSend).toBeCalledWith(errorEmbed);
    });
});