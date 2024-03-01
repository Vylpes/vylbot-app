import { Client, Partials } from "discord.js";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import { EventType } from "../constants/EventType";
import ICommandItem from "../contracts/ICommandItem";
import IEventItem from "../contracts/IEventItem";
import { Command } from "../type/command";

import { Events } from "./events";
import { Util } from "./util";
import AppDataSource from "../database/dataSources/appDataSource";
import ButtonEventItem from "../contracts/ButtonEventItem";
import { ButtonEvent } from "../type/buttonEvent";
import CacheHelper from "../helpers/CacheHelper";

export class CoreClient extends Client {
    private static _commandItems: ICommandItem[];
    private static _eventItems: IEventItem[];
    private static _buttonEvents: ButtonEventItem[];

    private _events: Events;
    private _util: Util;

    public static get commandItems(): ICommandItem[] {
        return this._commandItems;
    }

    public static get eventItems(): IEventItem[] {
        return this._eventItems;
    }

    public static get buttonEvents(): ButtonEventItem[] {
        return this._buttonEvents;
    }

    constructor(intents: number[], partials: Partials[]) {
        super({ intents: intents, partials: partials });
        dotenv.config();

        CoreClient._commandItems = [];
        CoreClient._eventItems = [];
        CoreClient._buttonEvents = [];

        this._events = new Events();
        this._util = new Util();
    }

    public async start() {
        if (!process.env.BOT_TOKEN) {
            console.error("BOT_TOKEN is not defined in .env");
            return;
        }

        await AppDataSource.initialize()
            .then(() => console.log("Data Source Initialized"))
            .catch((err) => console.error("Error Initialising Data Source", err));

        super.on("interactionCreate", this._events.onInteractionCreate);
        super.on("ready", this._events.onReady);

        await super.login(process.env.BOT_TOKEN);

        this.guilds.cache.forEach(async (guild) => {
            await CacheHelper.UpdateServerCache(guild);
        });

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

    public static RegisterButtonEvent(buttonId: string, event: ButtonEvent) {
        const item: ButtonEventItem = {
            ButtonId: buttonId,
            Event: event,
        };

        CoreClient._buttonEvents.push(item);
    }
}
