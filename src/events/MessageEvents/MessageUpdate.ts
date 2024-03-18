import { EmbedBuilder, Message, TextChannel } from "discord.js";
import EmbedColours from "../../constants/EmbedColours";
import IgnoredChannel from "../../database/entities/IgnoredChannel";
import SettingsHelper from "../../helpers/SettingsHelper";
import CacheHelper from "../../helpers/CacheHelper";

export default async function MessageUpdate(oldMessage: Message, newMessage: Message) {
    if (!newMessage.guild) return;
    if (newMessage.author.bot) return;

    await CacheHelper.UpdateServerCache(newMessage.guild);

    if (oldMessage.content == newMessage.content) return;

    const enabled = await SettingsHelper.GetSetting("event.message.update.enabled", newMessage.guild.id);
    if (!enabled || enabled.toLowerCase() != "true") return;

    const ignored = await IgnoredChannel.IsChannelIgnored(newMessage.channel.id);
    if (ignored) return;

    const embed = new EmbedBuilder()
        .setColor(EmbedColours.Ok)
        .setTitle("Message Edited")
        .setDescription(`${newMessage.author} \`${newMessage.author.tag}\``)
        .setThumbnail(newMessage.author.avatarURL())
        .addFields([
            {
                name: "Channel",
                value: newMessage.channel.toString(),
                inline: true,
            },
            {
                name: "Before",
                value: `\`\`\`${oldMessage.content || "*none*"}\`\`\``,
            },
            {
                name: "After",
                value: `\`\`\`${newMessage.content || "*none*"}\`\`\``,
            }
        ]);

        const channelSetting = await SettingsHelper.GetSetting("event.message.delete.channel", newMessage.guild.id);

        if (!channelSetting) return;

        const channel = newMessage.guild.channels.cache.find(x => x.name == channelSetting);

        if (!channel) return;

        const guildChannel = channel as TextChannel;

        await guildChannel.send({ embeds: [ embed ]});
}