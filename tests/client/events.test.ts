import { Events } from "../../src/client/events";
import { Message } from "discord.js";
import { Util } from "../../src/client/util";
import ICommandItem from "../../src/contracts/ICommandItem";
import { Command } from "../../src/type/command";
import { mock } from "jest-mock-extended";

jest.mock("../../src/client/util");

beforeEach(() => {
    Util.prototype.loadCommand = jest.fn();
});

describe('OnMessage', () => {
    test('Given Message Is Valid Expect Message Sent', async () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: 'events',
        };
    
        Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: true });
    
        const message = {
            guild: {},
            author: {
                bot: false,
            },
            content: "!test first",
        } as unknown as Message;

        const cmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
    
        const events = new Events();
    
        const result = await events.onMessage(message, commands);
    
        expect(result.valid).toBeTruthy();
    
        expect(result.context?.prefix).toBe('!');
        expect(result.context?.name).toBe('test');
        expect(result.context?.args.length).toBe(1);
        expect(result.context?.args[0]).toBe('first');
        expect(result.context?.message).toBe(message);
    });
    
    test('Given Guild Is Null, Expect Failed Result', async () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: 'events',
        }
    
        Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: true });
    
        const message = {
            guild: null,
            author: {
                bot: false,
            },
            content: "!test first",
        } as unknown as Message;

        const cmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
    
        const events = new Events();
    
        const result = await events.onMessage(message, commands);
    
        expect(result.valid).toBeFalsy();
        expect(result.message).toBe("Message was not sent in a guild, ignoring.");
    });
    
    test('Given Author Is A Bot, Expect Failed Result', async () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: 'events',
        }
    
        Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: true });
    
        const message = {
            guild: {},
            author: {
                bot: true,
            },
            content: "!test first",
        } as unknown as Message;

        const cmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
    
        const events = new Events();
    
        const result = await events.onMessage(message, commands);
    
        expect(result.valid).toBeFalsy();
        expect(result.message).toBe("Message was sent by a bot, ignoring.");
    });
    
    test('Given Message Content Was Not A Command, Expect Failed Result', async () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: 'events',
        }
    
        Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: true });
    
        const message = {
            guild: {},
            author: {
                bot: false,
            },
            content: "This is a standard message",
        } as unknown as Message;

        const cmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
    
        const events = new Events();
    
        const result = await events.onMessage(message, commands);
    
        expect(result.valid).toBeFalsy();
        expect(result.message).toBe("Message was not a command, ignoring.");
    });
    
    test('Given Message Had No Command Name, Expect Failed Result', async () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: 'events',
        }
    
        Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: true });
    
        const message = {
            guild: {},
            author: {
                bot: false,
            },
            content: "!",
        } as unknown as Message;

        const cmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
    
        const events = new Events();
    
        const result = await events.onMessage(message, commands);
    
        expect(result.valid).toBeFalsy();
        expect(result.message).toBe("Command name was not found");
    });
    
    test('Given Command Failed To Execute, Expect Failed Result', async () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: 'events',
        }
    
        Util.prototype.loadCommand = jest.fn().mockReturnValue({ valid: false, message: "Command failed" });
    
        const message = {
            guild: {},
            author: {
                bot: false,
            },
            content: "!test first",
        } as unknown as Message;

        const cmd = mock<Command>();

        const commandItem: ICommandItem = {
            Name: "test",
            Command: cmd
        };

        const commands: ICommandItem[] = [ commandItem ];
    
        const events = new Events();
    
        const result = await events.onMessage(message, commands);
    
        expect(result.valid).toBeFalsy();
        expect(result.message).toBe("Command failed");
    });
});

describe('OnReady', () => {
    test('Expect Console Log', () => {
        console.log = jest.fn();
    
        const events = new Events();
    
        events.onReady();
    
        expect(console.log).toBeCalledWith("Ready");
    });
});
