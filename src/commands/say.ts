import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../type/command";

export default class Say extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName('say')
            .setDescription('Have the bot reply with your message')
            .addStringOption(x =>
                x
                    .setName("message")
                    .setDescription("The message to repeat")
                    .setRequired(true));
    }

    public override async execute(interaction: CommandInteraction) {
        const message = interaction.options.get("message", true);

        await interaction.reply(message.value as string);
    }
}
