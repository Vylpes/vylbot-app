import { Message } from "discord.js";
import ICommandItem from "../contracts/ICommandItem";
import SettingsHelper from "../helpers/SettingsHelper";
import { Util } from "./util";

export class Events {
    private _util: Util;

    constructor() {
        this._util = new Util();
    }

    // Emit when a message is sent
    // Used to check for commands
    public async onMessage(message: Message, commands: ICommandItem[]) {
        if (!message.guild) return;
        if (message.author.bot) return;

        const prefix = await SettingsHelper.GetSetting("bot.prefix", message.guild.id);

        if (!prefix) return;

        if (message.content.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase()) {
            const args = message.content.substring(prefix.length).split(" ");
            const name = args.shift();

            if (!name) return;

            await this._util.loadCommand(name, args, message, commands);
        }
    }

    // Emit when bot is logged in and ready to use
    public onReady() {
        console.log("Ready");
    }
}
