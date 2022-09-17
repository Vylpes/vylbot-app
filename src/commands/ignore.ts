import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import IgnoredChannel from "../entity/IgnoredChannel";
import { Command } from "../type/command";

export default class Ignore extends Command {
    constructor() {
        super();

        super.Category = "Moderation";
        super.Roles = [
            "moderator"
        ];

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('ignore')
            .setDescription('Ignore events in this channel');
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.guildId) return;
 
        const isChannelIgnored = await IgnoredChannel.IsChannelIgnored(interaction.guildId);
 
        if (isChannelIgnored) {
            const entity = await IgnoredChannel.FetchOneById(IgnoredChannel, interaction.guildId);
            
            await IgnoredChannel.Remove(IgnoredChannel, entity);

            await interaction.reply('This channel will start being logged again.');
        } else {
            const entity = new IgnoredChannel(interaction.guildId);

            await entity.Save(IgnoredChannel, entity);

            await interaction.reply('This channel will now be ignored from logging.');
        }
    }
}