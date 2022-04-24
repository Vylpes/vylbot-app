import { mock } from "jest-mock-extended";

const connectionMock = mock<Connection>();
const qbuilderMock = mock<SelectQueryBuilder<any>>();

let repositoryMock = mock<Repository<any>>();
let settingMock = mock<Setting>();

jest.mock('typeorm', () => {
    qbuilderMock.where.mockReturnThis();
    qbuilderMock.select.mockReturnThis();
    repositoryMock.createQueryBuilder.mockReturnValue(qbuilderMock);
    repositoryMock.findOne.mockImplementation(async () => {
        return settingMock;
    });
    connectionMock.getRepository.mockReturnValue(repositoryMock);

    return {
        getConnection: () => connectionMock,
        createConnection: () => connectionMock,

        BaseEntity: class Mock {},
        ObjectType: () => {},
        Entity: () => {},
        InputType: () => {},
        Index: () => {},
        PrimaryColumn: () => {},
        Column: () => {},
        CreateDateColumn: () => {},
        UpdateDateColumn: () => {},
        OneToMany: () => {},
        ManyToOne: () => {},
    }
});

jest.mock("discord.js");
jest.mock("dotenv");
jest.mock("../../src/client/events");
jest.mock("../../src/client/util");
jest.mock("../../src/constants/DefaultValues");

import { CoreClient } from "../../src/client/client";

import { Client } from "discord.js";
import * as dotenv from "dotenv";
import { Events } from "../../src/client/events";
import { Util } from "../../src/client/util";
import { Command } from "../../src/type/command";
import { Event } from "../../src/type/event";
import DefaultValues from "../../src/constants/DefaultValues";
import { Connection, Repository, SelectQueryBuilder } from "typeorm";
import Setting from "../../src/entity/Setting";

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
})

describe('Constructor', () => {
    test('Expect Successful Initialisation', () => {
        const coreClient = new CoreClient();
    
        expect(coreClient).toBeInstanceOf(Client);
        expect(dotenv.config).toBeCalledTimes(1);
        expect(Events).toBeCalledTimes(1);
        expect(Util).toBeCalledTimes(1);
        expect(DefaultValues.useDevPrefix).toBe(false);
    });

    test('Given devmode parameter is true, Expect devmode prefix to be true', () => {
        const coreClient = new CoreClient(true);
    
        expect(coreClient).toBeInstanceOf(Client);
        expect(dotenv.config).toBeCalledTimes(1);
        expect(Events).toBeCalledTimes(1);
        expect(Util).toBeCalledTimes(1);
        expect(DefaultValues.useDevPrefix).toBe(true);
    });
});

describe('Start', () => {
    test('Given Env Is Valid, Expect Successful Start', async () => {
        process.env = {
            BOT_TOKEN: "TOKEN",
        };
    
        const coreClient = new CoreClient();

        await coreClient.start();
        
        expect(coreClient.on).toBeCalledWith("message", expect.any(Function));
        expect(coreClient.on).toBeCalledWith("ready", expect.any(Function));
    });
    
    test('Given BOT_TOKEN Is Null, Expect Failure', async () => {
        process.env = {};

        const consoleError = jest.fn();

        console.error = consoleError;
    
        const coreClient = new CoreClient();

        await coreClient.start();

        expect(consoleError).toBeCalledWith("BOT_TOKEN is not defined in .env");
        expect(coreClient.on).not.toBeCalled();
        expect(coreClient.login).not.toBeCalled();
    });
    
    test('Given BOT_TOKEN Is Empty, Expect Failure', async () => {
        process.env = {
            BOT_TOKEN: '',
        }
        
        const consoleError = jest.fn();

        console.error = consoleError;
    
        const coreClient = new CoreClient();

        await coreClient.start();

        expect(consoleError).toBeCalledWith("BOT_TOKEN is not defined in .env");
        expect(coreClient.on).not.toBeCalled();
        expect(coreClient.login).not.toBeCalled();
    });
});

describe('RegisterCommand', () => {
    test('Expect command added to register', () => {
        const cmd = mock<Command>();
        
        const client = new CoreClient();
        client.RegisterCommand("test", cmd);

        expect(client.commandItems.length).toBe(1);
        expect(client.commandItems[0].Name).toBe("test");
        expect(client.commandItems[0].Command).toBe(cmd);
    });
});

describe('RegisterEvent', () => {
    test('Expect event added to register', () => {
        const evt = mock<Event>();
        
        const client = new CoreClient();
        client.RegisterEvent(evt);

        expect(client.eventItems.length).toBe(1);
        expect(client.eventItems[0].Event).toBe(evt);
    });
});