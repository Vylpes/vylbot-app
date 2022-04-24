import { Message, MessageEmbed } from "discord.js";
import Poll from "../../src/commands/poll";
import { ICommandContext } from "../../src/contracts/ICommandContext";

describe('Constructor', () => {
    test('Expect properties to be set', () => {
        const poll = new Poll();

        expect(poll._category).toBe('General');
    });
});

describe('Execute', () => {
    test('Given input is valid, expect poll to be generated', async () => {
        const returnMessageReact = jest.fn();

        const returnMessage = {
            react: returnMessageReact
        } as unknown as Message;

        const messageChannelSend = jest.fn()
            .mockReturnValue(returnMessage);
        const messageDelete = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            },
            delete: messageDelete,
            deletable: true
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'poll',
            args: ['Test', 'title;', 'one;', 'two'],
            message: message
        };

        const poll = new Poll();

        const result = await poll.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(messageDelete).toBeCalledTimes(1);
        expect(returnMessageReact).toBeCalledTimes(2);

        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Test title');
        expect(embed.description).toBe(':one:  one\n:two:  two');
    });

    test('Given message is not deletable by client, expect it not to attempt deletion', async () => {
        const returnMessageReact = jest.fn();

        const returnMessage = {
            react: returnMessageReact
        } as unknown as Message;

        const messageChannelSend = jest.fn()
            .mockReturnValue(returnMessage);
        const messageDelete = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            },
            delete: messageDelete,
            deletable: false
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'poll',
            args: ['Test', 'title;', 'one;', 'two'],
            message: message
        };

        const poll = new Poll();

        const result = await poll.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(messageDelete).not.toBeCalled();
        expect(returnMessageReact).toBeCalledTimes(2);

        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Test title');
        expect(embed.description).toBe(':one:  one\n:two:  two');
    });

    test('Given no arguments, expect error embed', async () => {
        const returnMessageReact = jest.fn();

        const returnMessage = {
            react: returnMessageReact
        } as unknown as Message;

        const messageChannelSend = jest.fn()
            .mockReturnValue(returnMessage);
        const messageDelete = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            },
            delete: messageDelete,
            deletable: true
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'poll',
            args: [],
            message: message
        };

        const poll = new Poll();

        const result = await poll.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(messageDelete).not.toBeCalled();
        expect(returnMessageReact).not.toBeCalled();

        expect(result.embeds.length).toBe(1);

        // Error Embed
        const errorEmbed = result.embeds[0];
        
        expect(errorEmbed.description).toBe('Usage: <title>;<option 1>;<option 2>... (separate options with semicolons), maximum of 9 options');
    });

    test('Given only 1 option, expect error embed', async () => {
        const returnMessageReact = jest.fn();

        const returnMessage = {
            react: returnMessageReact
        } as unknown as Message;

        const messageChannelSend = jest.fn()
            .mockReturnValue(returnMessage);
        const messageDelete = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            },
            delete: messageDelete,
            deletable: true
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'poll',
            args: ['Test', 'title;', 'one'],
            message: message
        };

        const poll = new Poll();

        const result = await poll.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(messageDelete).not.toBeCalled();
        expect(returnMessageReact).not.toBeCalled();

        expect(result.embeds.length).toBe(1);

        // Error Embed
        const errorEmbed = result.embeds[0];
        
        expect(errorEmbed.description).toBe('Usage: <title>;<option 1>;<option 2>... (separate options with semicolons), maximum of 9 options');
    });

    test('Given 9 options, expect poll to be generated', async () => {
        const returnMessageReact = jest.fn();

        const returnMessage = {
            react: returnMessageReact
        } as unknown as Message;

        const messageChannelSend = jest.fn()
            .mockReturnValue(returnMessage);
        const messageDelete = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            },
            delete: messageDelete,
            deletable: true
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'poll',
            args: ['Test', 'title;', 'one;', 'two;', 'three;', 'four;', 'five;', 'six;', 'seven;', 'eight;', 'nine'],
            message: message
        };

        const poll = new Poll();

        const result = await poll.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(messageDelete).toBeCalledTimes(1);
        expect(returnMessageReact).toBeCalledTimes(9);

        expect(result.embeds.length).toBe(1);

        // Embed
        const embed = result.embeds[0];

        expect(embed.title).toBe('Test title');
        expect(embed.description).toBe(':one:  one\n:two:  two\n:three:  three\n:four:  four\n:five:  five\n:six:  six\n:seven:  seven\n:eight:  eight\n:nine:  nine');
    });

    test('Given 10 options, expect error embed', async () => {
        const returnMessageReact = jest.fn();

        const returnMessage = {
            react: returnMessageReact
        } as unknown as Message;

        const messageChannelSend = jest.fn()
            .mockReturnValue(returnMessage);
        const messageDelete = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            },
            delete: messageDelete,
            deletable: true
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'poll',
            args: ['Test', 'title;', 'one;', 'two;', 'three;', 'four;', 'five;', 'six;', 'seven;', 'eight;', 'nine;', 'ten'],
            message: message
        };

        const poll = new Poll();

        const result = await poll.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(messageDelete).not.toBeCalled();
        expect(returnMessageReact).not.toBeCalled();

        expect(result.embeds.length).toBe(1);

        // Error Embed
        const errorEmbed = result.embeds[0];
        
        expect(errorEmbed.description).toBe('Usage: <title>;<option 1>;<option 2>... (separate options with semicolons), maximum of 9 options');
    });
});