import { CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import IgnoredChannel from "../entity/IgnoredChannel";
import { Command } from "../type/command";

export default class Ignore extends Command {
    constructor() {
        super();

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('ignore')
            .setDescription('Ignore events in this channel')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const isChannelIgnored = await IgnoredChannel.IsChannelIgnored(interaction.guildId);

        if (isChannelIgnored) {
            const entity = await IgnoredChannel.FetchOneById(IgnoredChannel, interaction.guildId);

            if (!entity) {
                await interaction.reply('Unable to find channel.');
                return;
            }

            await IgnoredChannel.Remove(IgnoredChannel, entity);

            await interaction.reply('This channel will start being logged again.');
        } else {
            const entity = new IgnoredChannel(interaction.guildId);

            await entity.Save(IgnoredChannel, entity);

            await interaction.reply('This channel will now be ignored from logging.');
        }
    }
}