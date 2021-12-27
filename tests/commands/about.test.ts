import { Message } from "discord.js";
import { mock } from "jest-mock-extended";
import About from "../../src/commands/about";
import { ICommandContext } from "../../src/contracts/ICommandContext";
import PublicEmbed from "../../src/helpers/embeds/PublicEmbed";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect values set', () => {
        const about = new About();

        expect(about._category).toBe("General");
    });
});

describe('Execute', () => {
    test('Expect embed to be made and sent to the current channel', async () => {
        process.env = {
            BOT_VER: "BOT_VER",
            BOT_AUTHOR: "BOT_AUTHOR",
            BOT_DATE: "BOT_DATE"
        };

        const message = mock<Message>();
        message.channel.send = jest.fn();

        const context: ICommandContext = {
            name: "about",
            args: [],
            message: message
        };

        const about = new About();

        const result = await about.execute(context);

        expect(message.channel.send).toBeCalledTimes(1);
    });

    test('Expect embed send to have values', async () => {
        process.env = {
            BOT_VER: "BOT_VER",
            BOT_AUTHOR: "BOT_AUTHOR",
            BOT_DATE: "BOT_DATE"
        };

        const message = mock<Message>();
        message.channel.send = jest.fn();

        const context: ICommandContext = {
            name: "about",
            args: [],
            message: message
        };

        const about = new About();

        const result = await about.execute(context);

        expect(result.embeds.length).toBe(1);

        const embed = result.embeds[0];

        expect(embed.title).toBe('About');
        expect(embed.description).toBe('');
        expect(embed.fields.length).toBe(3);
    });

    test('Expect version field to have values', async () => {
        process.env = {
            BOT_VER: "BOT_VER",
            BOT_AUTHOR: "BOT_AUTHOR",
            BOT_DATE: "BOT_DATE"
        };

        const message = mock<Message>();
        message.channel.send = jest.fn();

        const context: ICommandContext = {
            name: "about",
            args: [],
            message: message
        };

        const about = new About();

        const result = await about.execute(context);

        const embed = result.embeds[0];
        const field = embed.fields[0];

        expect(field.name).toBe('Version');
        expect(field.value).toBe('BOT_VER');
    });

    test('Expect author field to have values', async () => {
        process.env = {
            BOT_VER: "BOT_VER",
            BOT_AUTHOR: "BOT_AUTHOR",
            BOT_DATE: "BOT_DATE"
        };

        const message = mock<Message>();
        message.channel.send = jest.fn();

        const context: ICommandContext = {
            name: "about",
            args: [],
            message: message
        };

        const about = new About();

        const result = await about.execute(context);

        const embed = result.embeds[0];
        const field = embed.fields[1];

        expect(field.name).toBe('Author');
        expect(field.value).toBe('BOT_AUTHOR');
    });

    test('Expect version field to have values', async () => {
        process.env = {
            BOT_VER: "BOT_VER",
            BOT_AUTHOR: "BOT_AUTHOR",
            BOT_DATE: "BOT_DATE"
        };
        
        const message = mock<Message>();
        message.channel.send = jest.fn();

        const context: ICommandContext = {
            name: "about",
            args: [],
            message: message
        };

        const about = new About();

        const result = await about.execute(context);

        const embed = result.embeds[0];
        const field = embed.fields[2];

        expect(field.name).toBe('Date');
        expect(field.value).toBe('BOT_DATE');
    });
});