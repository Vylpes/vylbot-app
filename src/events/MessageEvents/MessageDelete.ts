import { EmbedBuilder, Message, TextChannel } from "discord.js";
import EmbedColours from "../../constants/EmbedColours";
import IgnoredChannel from "../../database/entities/IgnoredChannel";
import SettingsHelper from "../../helpers/SettingsHelper";

export default async function MessageDelete(message: Message) {
    if (!message.guild) return;
    if (message.author.bot) return;

    const enabled = await SettingsHelper.GetSetting("event.message.delete.enabled", message.guild.id);
    if (!enabled || enabled.toLowerCase() != "true") return;

    const ignored = await IgnoredChannel.IsChannelIgnored(message.channel.id);
    if (ignored) return;

    const embed = new EmbedBuilder()
        .setColor(EmbedColours.Ok)
        .setTitle("Message Deleted")
        .setDescription(`${message.author} \`${message.author.tag}\``)
        .setThumbnail(message.author.avatarURL())
        .addFields([
            {
                name: "Channel",
                value: message.channel.toString(),
                inline: true,
            },
            {
                name: "Content",
                value: `\`\`\`${message.content || "*none*"}\`\`\``,
            }
        ]);

    if (message.attachments.size > 0) {
        embed.addFields([
            {
                name: "Attachments",
                value: message.attachments.size.toString(),
            }
        ]);
    }

    const channelSetting = await SettingsHelper.GetSetting("event.message.delete.channel", message.guild.id);

    if (!channelSetting) return;

    const channel = message.guild.channels.cache.find(x => x.name == channelSetting);

    if (!channel) return;

    const guildChannel = channel as TextChannel;

    await guildChannel.send({ embeds: [ embed ]});
}