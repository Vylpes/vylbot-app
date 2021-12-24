import { Message } from "discord.js";
import { mock } from "jest-mock-extended";
import About from "../../src/commands/about";
import { ICommandContext } from "../../src/contracts/ICommandContext";
import PublicEmbed from "../../src/helpers/embeds/PublicEmbed";

describe('Constructor', () => {
    test('Expect values set', () => {
        const about = new About();

        expect(about._category).toBe("General");
    });
});

describe('Execute', () => {
    test('Expect embed to be made and sent to the current channel', (done) => {
        const message = mock<Message>();
        message.channel.send = jest.fn().mockImplementation((embed: PublicEmbed) => {
            expect(embed.title).toBe('About');
            expect(embed.description).toBe('');

            done();
        });

        const context: ICommandContext = {
            name: "about",
            args: [],
            message: message
        };

        const about = new About();
        about.execute(context);
    });
});