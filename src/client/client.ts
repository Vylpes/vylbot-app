import { Client } from "discord.js";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import DefaultValues from "../constants/DefaultValues";
import ICommandItem from "../contracts/ICommandItem";
import IEventItem from "../contracts/IEventItem";
import { Command } from "../type/command";
import { Event } from "../type/event";

import { Events } from "./events";
import { Util } from "./util";

export class CoreClient extends Client {
    private static _commandItems: ICommandItem[];
    private static _eventItems: IEventItem[];
    
    private _events: Events;
    private _util: Util;

    public static get commandItems(): ICommandItem[] {
        return this._commandItems;
    }

    public static get eventItems(): IEventItem[] {
        return this._eventItems;
    }

    constructor(intents: number[], devmode: boolean = false) {
        super({ intents: intents });
        dotenv.config();

        DefaultValues.useDevPrefix = devmode;

        CoreClient._commandItems = [];
        CoreClient._eventItems = [];

        this._events = new Events();
        this._util = new Util();
    }

    public async start() {
        if (!process.env.BOT_TOKEN) {
            console.error("BOT_TOKEN is not defined in .env");
            return;
        }

        await createConnection().catch(e => {
            console.error(e);
            return;
        });

        super.on("messageCreate", (message) => {
            this._events.onMessageCreate(message, CoreClient._commandItems)
        });
        super.on("ready", this._events.onReady);

        super.login(process.env.BOT_TOKEN);

        this._util.loadEvents(this, CoreClient._eventItems);
    }

    public static RegisterCommand(name: string, command: Command, serverId?: string) {
        const item: ICommandItem = {
            Name: name,
            Command: command,
            ServerId: serverId,
        };

        CoreClient._commandItems.push(item);
    }

    public static RegisterEvent(event: Event) {
        const item: IEventItem = {
            Event: event,
        };

        CoreClient._eventItems.push(item);
    }
}
