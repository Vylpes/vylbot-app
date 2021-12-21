import { Client } from "discord.js";
import * as dotenv from "dotenv";

import { Events } from "./events";
import { Util } from "./util";

export class CoreClient extends Client {
    private _events: Events;
    private _util: Util;

    constructor() {
        super();
        dotenv.config();

        this._events = new Events();
        this._util = new Util();
    }

    public start() {
        if (!process.env.BOT_TOKEN) throw "BOT_TOKEN is not defined in .env";
        if (!process.env.BOT_PREFIX) throw "BOT_PREFIX is not defined in .env";
        if (!process.env.FOLDERS_COMMANDS) throw "FOLDERS_COMMANDS is not defined in .env";
        if (!process.env.FOLDERS_EVENTS) throw "FOLDERS_EVENTS is not defined in .env";

        super.on("message", this._events.onMessage);
        super.on("ready", this._events.onReady);

        super.login(process.env.BOT_TOKEN);

        this._util.loadEvents(this);
    }
}
