import { Client } from "discord.js";
import * as dotenv from "dotenv";
import ICommandItem from "../contracts/ICommandItem";
import IEventItem from "../contracts/IEventItem";
import { Command } from "../type/command";
import { Event } from "../type/event";

import { Events } from "./events";
import { Util } from "./util";

export class CoreClient extends Client {
    private _commandItems: ICommandItem[];
    private _eventItems: IEventItem[];
    
    private _events: Events;
    private _util: Util;

    public get commandItems(): ICommandItem[] {
        return this._commandItems;
    }

    public get eventItems(): IEventItem[] {
        return this._eventItems;
    }

    constructor() {
        super();
        dotenv.config();

        this._commandItems = [];
        this._eventItems = [];

        this._events = new Events();
        this._util = new Util();
    }

    public start() {
        if (!process.env.BOT_TOKEN) throw "BOT_TOKEN is not defined in .env";
        if (!process.env.BOT_PREFIX) throw "BOT_PREFIX is not defined in .env";
        if (!process.env.FOLDERS_COMMANDS) throw "FOLDERS_COMMANDS is not defined in .env";
        if (!process.env.FOLDERS_EVENTS) throw "FOLDERS_EVENTS is not defined in .env";

        super.on("message", (message) => this._events.onMessage(message, this._commandItems));
        super.on("ready", this._events.onReady);

        super.login(process.env.BOT_TOKEN);

        this._util.loadEvents(this, this._eventItems);
    }

    public RegisterCommand(name: string, command: Command) {
        const item: ICommandItem = {
            Name: name,
            Command: command,
        };

        this._commandItems.push(item);
    }

    public RegisterEvent(event: Event) {
        const item: IEventItem = {
            Event: event,
        };

        this._eventItems.push(item);
    }
}
