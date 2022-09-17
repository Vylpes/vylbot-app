import { CommandResponse } from "../constants/CommandResponse";
import { ICommandContext } from "../contracts/ICommandContext";
import { CommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";

export class Command {
    public CommandBuilder: any;

    public Roles: string[];
    public Category?: string;

    constructor() {
        this.Roles = [];
    }

    public precheck(interation: CommandInteraction): CommandResponse {
        return CommandResponse.Ok;
    }

    public async precheckAsync(interation: CommandInteraction): Promise<CommandResponse> {
        return CommandResponse.Ok;
    }
    
    public execute(interaction: CommandInteraction) {

    }
}
