import { CommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../type/command";
import { ICommandContext } from "../contracts/ICommandContext";

export default class Clear extends Command {
    constructor() {
        super();

        super.Category = "Moderation";
        super.Roles = [
            "moderator"
        ];

        super.CommandBuilder = new SlashCommandBuilder()
            .setName("clear")
            .setDescription("Clears the channel of messages")
            .addNumberOption(option =>
                option
                    .setName('count')
                    .setDescription('The amount to delete')
                    .setMinValue(1)
                    .setMaxValue(100));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const totalToClear = interaction.options.getNumber('count');

        if (!totalToClear || totalToClear <= 0 || totalToClear > 100) {
            await interaction.reply('Please specify an amount between 1 and 100.');
            return;
        }

        const channel = interaction.channel as TextChannel;
        await channel.bulkDelete(totalToClear);

        await interaction.reply(`${totalToClear} message(s) were removed.`);
    }
}