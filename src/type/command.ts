import { Message } from "discord.js";
import { ICommandContext } from "../contracts/ICommandContext";

export class Command {
    public _roles: string[];

    public _category?: string;

    constructor() {
        this._roles = [];
    }

    public execute(context: ICommandContext) {

    }
}
