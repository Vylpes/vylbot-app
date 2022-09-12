import { CommandResponse } from "../constants/CommandResponse";
import { ICommandContext } from "../contracts/ICommandContext";
import { SlashCommandBuilder } from "discord.js";

export class Command {
    public SlashCommandBuilder: SlashCommandBuilder;

    public Roles: string[];
    public Category?: string;

    constructor() {
        this.Roles = [];
    }

    public precheck(context: ICommandContext): CommandResponse {
        return CommandResponse.Ok;
    }

    public async precheckAsync(context: ICommandContext): Promise<CommandResponse> {
        return CommandResponse.Ok;
    }

    public execute(context: ICommandContext) {

    }
}
