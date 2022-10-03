import { Client } from "discord.js";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import { EventType } from "../constants/EventType";
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

    constructor(intents: number[]) {
        super({ intents: intents });
        dotenv.config();

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

        super.on("interactionCreate", this._events.onInteractionCreate);
        super.on("ready", this._events.onReady);

        await super.login(process.env.BOT_TOKEN);

        this._util.loadEvents(this, CoreClient._eventItems);
        this._util.loadSlashCommands(this);
    }

    public static RegisterCommand(name: string, command: Command, serverId?: string) {
        const item: ICommandItem = {
            Name: name,
            Command: command,
            ServerId: serverId,
        };

        CoreClient._commandItems.push(item);
    }

    public static RegisterEvent(eventType: EventType, func: Function) {
        const item: IEventItem = {
            EventType: eventType,
            ExecutionFunction: func,
        };

        CoreClient._eventItems.push(item);
    }
}
