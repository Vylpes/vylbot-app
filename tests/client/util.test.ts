import discordjs, { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import { Util } from "../../src/client/util";
import { CoreClient } from "../../src/client/client";
import { Command } from "../../src/type/command";
import IEventItem from "../../src/contracts/IEventItem";
import { EventType } from "../../src/constants/EventType";

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = {};
});

describe("loadSlashCommands", () => {
    test("EXPECT slash commands to be loaded to the discord API", () => {
        process.env.BOT_TOKEN = "token";
        process.env.BOT_CLIENTID = "clientid";

        const client = {
            guilds: {
                cache: {
                    has: jest.fn().mockReturnValue(true),
                }
            }
        } as unknown as Client;

        const setTokenPutMock = jest.fn();
        const setTokenMock = jest.fn().mockReturnValue({
            put: setTokenPutMock,
        });

        REST.prototype.setToken = setTokenMock;
        Routes.applicationCommands = jest.fn().mockReturnValue("command url");
        Routes.applicationGuildCommands = jest.fn().mockReturnValue("guild command url");

        CoreClient.commandItems = [
            {
                Name: "global",
                Command: {
                    CommandBuilder: {
                        name: "global"
                    } as SlashCommandBuilder,
                } as Command,
            },
            {
                Name: "server-specific",
                Command: {
                    CommandBuilder: {
                        name: "server",
                    } as SlashCommandBuilder,
                } as Command,
                ServerId: "123",
            }
        ];

        const util = new Util();
        util.loadSlashCommands(client);

        expect(setTokenMock).toHaveBeenCalledWith("token");

        expect(setTokenPutMock).toHaveBeenCalledTimes(2);
        expect(setTokenPutMock).toHaveBeenCalledWith("command url", { body: [ CoreClient.commandItems[0].Command.CommandBuilder ] });
        expect(setTokenPutMock).toHaveBeenCalledWith("guild command url", { body: [ CoreClient.commandItems[1].Command.CommandBuilder ]});

        expect(client.guilds.cache.has).toHaveBeenCalledTimes(1);
        expect(client.guilds.cache.has).toHaveBeenCalledWith("123");

        expect(Routes.applicationCommands).toHaveBeenCalledTimes(1);
        expect(Routes.applicationCommands).toHaveBeenCalledWith("clientid");

        expect(Routes.applicationGuildCommands).toHaveBeenCalledTimes(1);
        expect(Routes.applicationGuildCommands).toHaveBeenCalledWith("clientid", "123");
    });

    test("GIVEN bot is not in a guild for a server command, EXPECT this to be ignored", () => {
        process.env.BOT_TOKEN = "token";
        process.env.BOT_CLIENTID = "clientid";

        const client = {
            guilds: {
                cache: {
                    has: jest.fn().mockReturnValue(false),
                }
            }
        } as unknown as Client;

        const setTokenPutMock = jest.fn();
        const setTokenMock = jest.fn().mockReturnValue({
            put: setTokenPutMock,
        });

        REST.prototype.setToken = setTokenMock;
        Routes.applicationCommands = jest.fn().mockReturnValue("command url");
        Routes.applicationGuildCommands = jest.fn().mockReturnValue("guild command url");

        CoreClient.commandItems = [
            {
                Name: "server-specific",
                Command: {
                    CommandBuilder: {
                        name: "server",
                    } as SlashCommandBuilder,
                } as Command,
                ServerId: "123",
            }
        ];

        const util = new Util();
        util.loadSlashCommands(client);

        expect(Routes.applicationGuildCommands).not.toHaveBeenCalled();
    });
});

describe("loadEvents", () => {
    test("GIVEN event type is channelCreate, EXPECT event function to be executed", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.ChannelCreate,
                ExecutionFunction: jest.fn(),
            }
        ];

        const util = new Util();
        util.loadEvents(client, events);

        expect(client.on).toHaveBeenCalledTimes(1);
        expect(client.on).toHaveBeenCalledWith("channelCreate", expect.any(Function));
    });

    test("GIVEN event type is channelDelete, EXPECT event function to be executed", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.ChannelDelete,
                ExecutionFunction: jest.fn(),
            }
        ];

        const util = new Util();
        util.loadEvents(client, events);

        expect(client.on).toHaveBeenCalledTimes(1);
        expect(client.on).toHaveBeenCalledWith("channelDelete", expect.any(Function));
    });

    test("GIVEN event type is channelUpdate, EXPECT event function to be executed", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.ChannelUpdate,
                ExecutionFunction: jest.fn(),
            }
        ];

        const util = new Util();
        util.loadEvents(client, events);

        expect(client.on).toHaveBeenCalledTimes(1);
        expect(client.on).toHaveBeenCalledWith("channelUpdate", expect.any(Function));
    });

    test("GIVEN event type is guildBanAdd, EXPECT event function to be executed", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.GuildBanAdd,
                ExecutionFunction: jest.fn(),
            }
        ];

        const util = new Util();
        util.loadEvents(client, events);

        expect(client.on).toHaveBeenCalledTimes(1);
        expect(client.on).toHaveBeenCalledWith("guildBanAdd", expect.any(Function));
    });

    test("GIVEN event type is guildBanRemove, EXPECT event function to be executed", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.GuildBanRemove,
                ExecutionFunction: jest.fn(),
            }
        ];

        const util = new Util();
        util.loadEvents(client, events);

        expect(client.on).toHaveBeenCalledTimes(1);
        expect(client.on).toHaveBeenCalledWith("guildBanRemove", expect.any(Function));
    });

    test("GIVEN event type is guildCreate, EXPECT event function to be executed", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.GuildCreate,
                ExecutionFunction: jest.fn(),
            }
        ];

        const util = new Util();
        util.loadEvents(client, events);

        expect(client.on).toHaveBeenCalledTimes(1);
        expect(client.on).toHaveBeenCalledWith("guildCreate", expect.any(Function));
    });

    test("GIVEN event type is guildMemberAdd, EXPECT event function to be executed", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.GuildMemberAdd,
                ExecutionFunction: jest.fn(),
            }
        ];

        const util = new Util();
        util.loadEvents(client, events);

        expect(client.on).toHaveBeenCalledTimes(1);
        expect(client.on).toHaveBeenCalledWith("guildMemberAdd", expect.any(Function));
    });

    test("GIVEN event type is guildMemberRemove, EXPECT event function to be executed", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.GuildMemberRemove,
                ExecutionFunction: jest.fn(),
            }
        ];

        const util = new Util();
        util.loadEvents(client, events);

        expect(client.on).toHaveBeenCalledTimes(1);
        expect(client.on).toHaveBeenCalledWith("guildMemberRemove", expect.any(Function));
    });

    test("GIVEN event type is messageCreate, EXPECT event function to be executed", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.MessageCreate,
                ExecutionFunction: jest.fn(),
            }
        ];

        const util = new Util();
        util.loadEvents(client, events);

        expect(client.on).toHaveBeenCalledTimes(1);
        expect(client.on).toHaveBeenCalledWith("messageCreate", expect.any(Function));
    });

    test("GIVEN event type is messageDelete, EXPECT event function to be executed", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.MessageDelete,
                ExecutionFunction: jest.fn(),
            }
        ];

        const util = new Util();
        util.loadEvents(client, events);

        expect(client.on).toHaveBeenCalledTimes(1);
        expect(client.on).toHaveBeenCalledWith("messageDelete", expect.any(Function));
    });

    test("GIVEN event type is messageUpdate, EXPECT event function to be executed", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.MessageUpdate,
                ExecutionFunction: jest.fn(),
            }
        ];

        const util = new Util();
        util.loadEvents(client, events);

        expect(client.on).toHaveBeenCalledTimes(1);
        expect(client.on).toHaveBeenCalledWith("messageUpdate", expect.any(Function));
    });

    test("GIVEN event type is not implemented, EXPECT error", () => {
        const client = {
            on: jest.fn(),
        } as unknown as Client;
        const events: IEventItem[] = [
            {
                EventType: EventType.Ready,
                ExecutionFunction: jest.fn(),
            }
        ];

        console.error = jest.fn();

        const util = new Util();
        util.loadEvents(client, events);

        expect(console.error).toHaveBeenCalledWith("Event not implemented.");
    });
});