import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import EmbedColours from "../../constants/EmbedColours";
import SettingsHelper from "../../helpers/SettingsHelper";

export default async function GuildMemberAdd(member: GuildMember) {
    if (!member.guild) return;

    const enabled = await SettingsHelper.GetSetting("event.member.add.enabled", member.guild.id);
    if (!enabled || enabled.toLowerCase() != "true") return;

    const embed = new EmbedBuilder()
        .setColor(EmbedColours.Ok)
        .setTitle('Member Joined')
        .setDescription(`${member.user} \`${member.user.tag}\``)
        .setFooter({ text: `Id: ${member.user.id}` })
        .addFields([
            {
                name: 'Created',
                value: member.user.createdAt.toISOString(),
            }
        ]);

    const channelSetting = await SettingsHelper.GetSetting("event.member.add.channel", member.guild.id);

    if (!channelSetting) return;

    const channel = member.guild.channels.cache.find(x => x.name == channelSetting);

    if (!channel) return;

    const guildChannel = channel as TextChannel;

    await guildChannel.send({ embeds: [embed ]});
}