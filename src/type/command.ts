import { CommandInteraction, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type CommandBuilder = SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;

export abstract class Command {
    public CommandBuilder: CommandBuilder;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Abstract class, used in child classees
    public execute(interaction: CommandInteraction) {

    }
}
