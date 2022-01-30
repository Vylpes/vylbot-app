import { Message } from "discord.js";
import Evaluate from "../../src/commands/eval";
import { ICommandContext } from "../../src/contracts/ICommandContext";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect values to be set', () => {
        const evaluate = new Evaluate();

        expect(evaluate._category).toBe('Owner');
    });
});

describe('Execute', () => {
    test('Given user has permission, expect eval statement ran', () => {
        process.env = {
            BOT_OWNERID: 'OWNERID'
        };

        console.log = jest.fn();
        global.eval = jest.fn()
            .mockReturnValue('General Kenobi');

        const messageChannelSend = jest.fn();

        const message = {
            author: {
                id: 'OWNERID'
            },
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'eval',
            args: ['echo', 'Hello', 'there'],
            message: message
        };

        const evaluate = new Evaluate();

        const result = evaluate.execute(context);

        expect(console.log).toBeCalledWith('Eval Statement: echo Hello there');
        expect(global.eval).toBeCalledWith('echo Hello there');
        expect(result.embeds.length).toBe(1);

        // PublicEmbed
        const publicEmbed = result.embeds[0];

        expect(publicEmbed.title).toBe('');
        expect(publicEmbed.description).toBe('General Kenobi');
    });

    test('Given user does not have permission, expect nothing to occur', () => {
        process.env = {
            BOT_OWNERID: 'DIFFERENT'
        };

        console.log = jest.fn();
        global.eval = jest.fn()
            .mockReturnValue('General Kenobi');

        const messageChannelSend = jest.fn();

        const message = {
            author: {
                id: 'OWNERID'
            },
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'eval',
            args: ['echo', 'Hello', 'there'],
            message: message
        };

        const evaluate = new Evaluate();

        const result = evaluate.execute(context);

        expect(console.log).not.toBeCalled();
        expect(global.eval).not.toBeCalled();
        expect(result.embeds.length).toBe(0);
    });

    test('Given eval failed, expect error embed to be sent', () => {
        process.env = {
            BOT_OWNERID: 'OWNERID'
        };

        console.log = jest.fn();
        global.eval = jest.fn()
            .mockImplementation(() => {
                throw new Error('Error message');
            });

        const messageChannelSend = jest.fn();

        const message = {
            author: {
                id: 'OWNERID'
            },
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'eval',
            args: ['echo', 'Hello', 'there'],
            message: message
        };

        const evaluate = new Evaluate();

        const result = evaluate.execute(context);

        expect(console.log).toBeCalledWith('Eval Statement: echo Hello there');
        expect(global.eval).toBeCalledWith('echo Hello there');
        expect(result.embeds.length).toBe(1);

        // ErrorEmbed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.title).toBeNull();
        expect(errorEmbed.description).toBe('Error: Error message');
    });
});