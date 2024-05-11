import { CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import IgnoredChannel from "../database/entities/IgnoredChannel";
import { Command } from "../type/command";

export default class Ignore extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName('ignore')
            .setDescription('Ignore events in this channel')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);
    }

    public override async execute(interaction: CommandInteraction) {
        const isChannelIgnored = await IgnoredChannel.IsChannelIgnored(interaction.channelId);

        if (isChannelIgnored) {
            const entity = await IgnoredChannel.FetchOneById(IgnoredChannel, interaction.channelId);

            await IgnoredChannel.Remove(IgnoredChannel, entity!);

            await interaction.reply('This channel will start being logged again.');
        } else {
            const entity = new IgnoredChannel(interaction.channelId);

            await entity.Save(IgnoredChannel, entity);

            await interaction.reply('This channel will now be ignored from logging.');
        }
    }
}