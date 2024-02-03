import { CommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../type/command";

export default class Clear extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("clear")
            .setDescription("Clears the channel of messages")
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
            .addNumberOption(option =>
                option
                    .setName('count')
                    .setDescription('The amount to delete')
                    .setRequired(true)
                    .setMinValue(1)
                    .setMaxValue(100));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.channel) return;

        const totalToClear = interaction.options.getNumber('count');

        if (!totalToClear || totalToClear <= 0 || totalToClear > 100) {
            await interaction.reply('Please specify an amount between 1 and 100.');
            return;
        }

        const channel = interaction.channel as TextChannel;

        if (!channel.manageable) {
            await interaction.reply('Insufficient permissions. Please contact a moderator.');
            return;
        }

        await channel.bulkDelete(totalToClear);

        await interaction.reply(`${totalToClear} message(s) were removed.`);
    }
}