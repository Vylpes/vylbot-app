import { CoreClient } from "../../src/client/client";

import { Client } from "discord.js";
import * as dotenv from "dotenv";
import { Events } from "../../src/client/events";
import { Util } from "../../src/client/util";
import { Command } from "../../src/type/command";
import ICommandItem from "../../src/contracts/ICommandItem";
import { mock } from "jest-mock-extended";
import IEventItem from "../../src/contracts/IEventItem";
import { Event } from "../../src/type/event";

jest.mock("discord.js");
jest.mock("dotenv");
jest.mock("../../src/client/events");
jest.mock("../../src/client/util");

describe('Constructor', () => {
    test('Constructor_ExpectSuccessfulInitialisation', () => {
        const coreClient = new CoreClient();
    
        expect(coreClient).toBeInstanceOf(Client);
        expect(dotenv.config).toBeCalledTimes(1);
        expect(Events).toBeCalledTimes(1);
        expect(Util).toBeCalledTimes(1);
    });
});

describe('Start', () => {
    test('Given Env Is Valid, Expect Successful Start', () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: 'events',
        }
    
        const coreClient = new CoreClient();
        
        expect(() => coreClient.start()).not.toThrow();
        expect(coreClient.on).toBeCalledWith("message", expect.any(Function));
        expect(coreClient.on).toBeCalledWith("ready", expect.any(Function));
    });
    
    test('Given BOT_TOKEN Is Null, Expect Failure', () => {
        process.env = {
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: 'events',
        }
    
        const coreClient = new CoreClient();
        
        expect(() => coreClient.start()).toThrow("BOT_TOKEN is not defined in .env");
    });
    
    test('Given BOT_TOKEN Is Empty, Expect Failure', () => {
        process.env = {
            BOT_TOKEN: '',
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: 'events',
        }
    
        const coreClient = new CoreClient();
        
        expect(() => coreClient.start()).toThrow("BOT_TOKEN is not defined in .env");
    });
    
    test('Given BOT_PREFIX Is Null, Expect Failure', () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: 'events',
        }
    
        const coreClient = new CoreClient();
        
        expect(() => coreClient.start()).toThrow("BOT_PREFIX is not defined in .env");
    });
    
    test('Given BOT_PREFIX Is Empty, Expect Failure', () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: 'events',
        }
    
        const coreClient = new CoreClient();
        
        expect(() => coreClient.start()).toThrow("BOT_PREFIX is not defined in .env");
    });
    
    test('Given FOLDERS_COMMANDS Is Null, Expect Failure', () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '!',
            FOLDERS_EVENTS: 'events',
        }
    
        const coreClient = new CoreClient();
        
        expect(() => coreClient.start()).toThrow("FOLDERS_COMMANDS is not defined in .env");
    });
    
    test('Given FOLDERS_COMMANDS Is Empty, Expect Failure', () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: '',
            FOLDERS_EVENTS: 'events',
        }
    
        const coreClient = new CoreClient();
        
        expect(() => coreClient.start()).toThrow("FOLDERS_COMMANDS is not defined in .env");
    });
    
    test('Given FOLDERS_EVENTS Is Null, Expect Failure', () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: 'commands',
        }
    
        const coreClient = new CoreClient();
        
        expect(() => coreClient.start()).toThrow("FOLDERS_EVENTS is not defined in .env");
    });
    
    test('Given FOLDERS_EVENTS Is Empty, Expect Failure', () => {
        process.env = {
            BOT_TOKEN: 'TOKEN',
            BOT_PREFIX: '!',
            FOLDERS_COMMANDS: 'commands',
            FOLDERS_EVENTS: '',
        }
    
        const coreClient = new CoreClient();
        
        expect(() => coreClient.start()).toThrow("FOLDERS_EVENTS is not defined in .env");
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