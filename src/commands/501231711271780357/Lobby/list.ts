import { CacheType, CommandInteraction, EmbedBuilder, GuildBasedChannel, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Command } from "../../../type/command";
import { default as eLobby } from "../../../entity/501231711271780357/Lobby";
import EmbedColours from "../../../constants/EmbedColours";

export default class ListLobby extends Command {
    constructor() {
        super();

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('listlobby')
            .setDescription('Lists all channels set up as lobbies')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers);
    }

    public override async execute(interaction: CommandInteraction<CacheType>) {
        if (!interaction.guild) {
            await interaction.reply('Guild not found.');
            return;
        }

        const channels: eLobby[] = [];

        interaction.guild.channels.cache.forEach(async (channel) => {
            const lobby = await eLobby.FetchOneByChannelId(channel.id);

            if (lobby) {
                channels.push(lobby);
            }
        });

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Lobbies")
            .setDescription(`Channels: ${channels.length}`);

        channels.forEach(lobby => {
            embed.addFields([
                {
                    name: `<#${lobby.ChannelId}>`,
                    value: `Last Used: ${lobby.LastUsed}`
                }
            ]);
        });

        await interaction.reply({ embeds: [ embed ]});
    }
}