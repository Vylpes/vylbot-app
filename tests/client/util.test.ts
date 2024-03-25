import { Client, SlashCommandBuilder } from "discord.js";
import { Util } from "../../src/client/util";
import { CoreClient } from "../../src/client/client";
import { Command } from "../../src/type/command";

jest.mock("discord.js", () => {
    return {
        Client: jest.fn(),
        REST: jest.fn().mockImplementation(() => {
            return {
                v10: {
                    put: jest.fn(),
                },
                setToken: jest.fn(),
            }
        }),
        Routes: {
            applicationCommands: jest.fn().mockReturnValue("command url"),
            applicationGuildCommands: jest.fn().mockReturnValue("guild command url"),
        },
    }
});

import { REST, Routes } from "discord.js";

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

        expect(REST).toHaveBeenCalledWith({ version: '10' });
        expect(REST.prototype.setToken).toHaveBeenCalledWith("token");

        expect(REST.prototype.put).toHaveBeenCalledTimes(2);
        expect(REST.prototype.put).toHaveBeenCalledWith("command url", { body: [ CoreClient.commandItems[0].Command.CommandBuilder ] });
        expect(REST.prototype.put).toHaveBeenCalledWith("guild command url", { body: [ CoreClient.commandItems[1].Command.CommandBuilder ]});

        expect(client.guilds.cache.has).toHaveBeenCalledTimes(1);
        expect(client.guilds.cache.has).toHaveBeenCalledWith("123");

        expect(Routes.applicationCommands).toHaveBeenCalledTimes(1);
        expect(Routes.applicationCommands).toHaveBeenCalledWith("clientid");

        expect(Routes.applicationGuildCommands).toHaveBeenCalledTimes(1);
        expect(Routes.applicationGuildCommands).toHaveBeenCalledWith("clientid", "123");
    });

    test.todo("GIVEN bot is not in a guild for a server command, EXPECT this to be ignored");
});

describe("loadEvents", () => {
    test.todo("GIVEN event type is channelCreate, EXPECT event function to be executed");

    test.todo("GIVEN event type is channelDelete, EXPECT event function to be executed");

    test.todo("GIVEN event type is channelUpdate, EXPECT event function to be executed");

    test.todo("GIVEN event type is guildBanAdd, EXPECT event function to be executed");

    test.todo("GIVEN event type is guildBanRemove, EXPECT event function to be executed");

    test.todo("GIVEN event type is guildCreate, EXPECT event function to be executed");

    test.todo("GIVEN event type is guildMemberAdd, EXPECT event function to be executed");

    test.todo("GIVEN event type is guildMemberRemove, EXPECT event function to be executed");

    test.todo("GIVEN event type is messageCreate, EXPECT event function to be executed");

    test.todo("GIVEN event type is messageDelete, EXPECT event function to be executed");

    test.todo("GIVEN event type is messageUpdate, EXPECT event function to be executed");

    test.todo("GIVEN event type is not implemented, EXPECT error");
});