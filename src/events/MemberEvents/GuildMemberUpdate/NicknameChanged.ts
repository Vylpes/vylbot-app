import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import EmbedColours from "../../../constants/EmbedColours";
import SettingsHelper from "../../../helpers/SettingsHelper";

export default async function NicknameChanged(oldMember: GuildMember, newMember: GuildMember) {
    const enabled = await SettingsHelper.GetSetting("event.member.update.enabled", newMember.guild.id);
    if (!enabled || enabled.toLowerCase() != "true") return;

    const oldNickname = oldMember.nickname || "*none*";
    const newNickname = newMember.nickname || "*none*";

    const embed = new EmbedBuilder()
        .setColor(EmbedColours.Ok)
        .setTitle('Nickname Changed')
        .setDescription(`${newMember.user} \`${newMember.user.tag}\``)
        .setFooter({ text: `Id: ${newMember.user.id}` })
        .addFields([
            {
                name: 'Before',
                value: oldNickname,
            },
            {
                name: 'After',
                value: newNickname,
            },
        ]);

        const channelSetting = await SettingsHelper.GetSetting("event.member.update.channel", newMember.guild.id);

        if (!channelSetting) return;

        const channel = newMember.guild.channels.cache.find(x => x.name == channelSetting);

        if (!channel) return;

        const guildChannel = channel as TextChannel;

        await guildChannel.send({ embeds: [embed ]});
}