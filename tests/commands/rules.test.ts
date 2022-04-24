import { Message } from "discord.js";
import Rules from "../../src/commands/rules";
import { ICommandContext } from "../../src/contracts/ICommandContext";

const oldCwd = process.cwd();

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect properties to be set', () => {
        process.env = {
            ROLES_MODERATOR: "Moderator"
        };

        const rules = new Rules();

        expect(rules._category).toBe("Admin");
        expect(rules._roles.length).toBe(1);
        expect(rules._roles[0]).toBe("Moderator");
    });
});

describe('Execute', () => {
    test('Given rules exist, expect rules to be sent to current channel', () => {
        process.env = {
            COMMANDS_RULES_FILE: 'rules/rules.json'
        };

        process.cwd = jest.fn()
			.mockReturnValue(`${oldCwd}/tests/_mocks`);

        const messageChannelSend = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'rules',
            args: [],
            message: message
        };

        const rules = new Rules();

        const result = rules.execute(context);

        expect(messageChannelSend).toBeCalledTimes(2);
        expect(result.embeds.length).toBe(2);

        // Header Embed
        const embedHeader = result.embeds[0];

        expect(embedHeader.title).toBe("");
        expect(embedHeader.description).toBe("");
        expect(embedHeader.image?.url).toBe("IMAGEURL");
        expect(embedHeader.footer?.text).toBe("");

        // Main Embed
        const embedMain = result.embeds[1];

        expect(embedMain.title).toBe("TITLE 1");
        expect(embedMain.description).toBe("DESCRIPTION 1A\nDESCRIPTION 1B");
        expect(embedMain.image?.url).toBe("");
        expect(embedMain.footer?.text).toBe("FOOTER 1");
    });

    test('Given rules file does not exist, expect does not exist error', () => {
        process.env = {
            COMMANDS_RULES_FILE: 'rules/none.json'
        };

        process.cwd = jest.fn()
			.mockReturnValue(`${oldCwd}/tests/_mocks`);

        const messageChannelSend = jest.fn();

        const message = {
            channel: {
                send: messageChannelSend
            }
        } as unknown as Message;

        const context: ICommandContext = {
            name: 'rules',
            args: [],
            message: message
        };

        const rules = new Rules();

        const result = rules.execute(context);

        expect(messageChannelSend).toBeCalledTimes(1);
        expect(result.embeds.length).toBe(1);
        
        // Error Embed
        const errorEmbed = result.embeds[0];

        expect(errorEmbed.description).toBe("Rules file doesn't exist");
    });
});