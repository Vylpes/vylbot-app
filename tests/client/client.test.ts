import { Partials, Client } from "discord.js";
import { CoreClient } from "../../src/client/client";
import * as dotenv from "dotenv";
import AppDataSource from "../../src/database/dataSources/appDataSource";
import { Util } from "../../src/client/util";
import { Command } from "../../src/type/command";
import { EventType } from "../../src/constants/EventType";
import { ButtonEvent } from "../../src/type/buttonEvent";

jest.mock("dotenv");

beforeEach(() => {
    jest.clearAllMocks();

    process.env = {};
});

describe('constructor', () => {
    test("EXPECT properties to be set", () => {
        const client = new CoreClient([1, 2, 3], [Partials.User]);

        expect(dotenv.config).toHaveBeenCalledTimes(1);

        expect(client).toBeDefined();
        expect(CoreClient.commandItems).toEqual([]);
        expect(CoreClient.eventItems).toEqual([]);
        expect(CoreClient.buttonEvents).toEqual([]);
        expect(client).toHaveProperty("_events");
        expect(client).toHaveProperty("_util");
    });
});

describe('start', () => {
    test("EXPECT bot to start", async () => {
        process.env.BOT_TOKEN = "token";
        console.error = jest.fn();
        AppDataSource.initialize = jest.fn().mockResolvedValue(undefined);

        const client = new CoreClient([1, 2, 3], [Partials.User]);

        const loadSlashCommands = jest.spyOn(Util.prototype, "loadSlashCommands").mockImplementation();
        const loadEvents = jest.spyOn(Util.prototype, "loadEvents").mockImplementation();

        Client.prototype.login = jest.fn();
        Client.prototype.on = jest.fn();

        await client.start();

        expect(AppDataSource.initialize).toHaveBeenCalledTimes(1);
        expect(console.error).not.toHaveBeenCalled();

        expect(client.login).toHaveBeenCalledTimes(1);
        expect(client.login).toHaveBeenCalledWith("token");

        expect(client.on).toHaveBeenCalledTimes(2);
        expect(client.on).toHaveBeenCalledWith("interactionCreate", expect.any(Function));
        expect(client.on).toHaveBeenCalledWith("ready", expect.any(Function))

        expect(loadSlashCommands).toHaveBeenCalledTimes(1);
        expect(loadSlashCommands).toHaveBeenCalledWith(client);

        expect(loadEvents).toHaveBeenCalledTimes(1);
        expect(loadEvents).toHaveBeenCalledWith(client, []);
    });

    test("GIVEN BOT_TOKEN is not in env var, EXPECT error", async () => {
        console.error = jest.fn();

        const client = new CoreClient([1, 2, 3], [ Partials.User ]);

        await client.start();

        expect(console.error).toHaveBeenCalledWith("BOT_TOKEN is not defined in .env");
    });

    test("GIVEN database connection can not be initialised, EXPECT error", async () => {
        process.env.BOT_TOKEN = "token";
        console.log = jest.fn();
        console.error = jest.fn();
        AppDataSource.initialize = jest.fn().mockRejectedValue("error");

        const client = new CoreClient([1, 2, 3], [Partials.User]);

        await client.start();

        expect(console.log).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Error Initialising Data Source", "error");
    });
});

describe('RegisterCommand', () => {
    test("EXPECT command to be added to list", () => {
        CoreClient.RegisterCommand("name", {} as Command, "serverId");

        expect(CoreClient.commandItems).toStrictEqual([
            {
                Name: "name",
                Command: {},
                ServerId: "serverId",
            }
        ])
    });
});

describe("RegisterEvent", () => {
    test("EXPECT event to be added to list", () => {
        CoreClient.RegisterEvent(EventType.ChannelCreate, () => {});

        expect(CoreClient.eventItems).toStrictEqual([
            {
                EventType: EventType.ChannelCreate,
                ExecutionFunction: expect.any(Function),
            }
        ]);
    });
});

describe("RegisterButtonEvent", () => {
    test("EXPECT button event to be added to list", () => {
        CoreClient.RegisterButtonEvent("buttonId", {} as ButtonEvent);

        expect(CoreClient.buttonEvents).toStrictEqual([
            {
                ButtonId: "buttonId",
                Event: {},
            }
        ])
    });
});