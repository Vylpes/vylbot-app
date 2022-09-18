import { Event } from "../type/event";
import { EmbedBuilder, Message, TextChannel } from "discord.js";
import SettingsHelper from "../helpers/SettingsHelper";
import OnMessage from "./MessageEvents/OnMessage";
import IgnoredChannel from "../entity/IgnoredChannel";
import EmbedColours from "../constants/EmbedColours";

export default class MessageEvents extends Event {
    constructor() {
        super();
    }

    public override async messageDelete(message: Message) {
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
                    value: `\`\`\`${message.attachments.map(x => x.url).join("\n")}\`\`\``
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

    public override async messageUpdate(oldMessage: Message, newMessage: Message) {
        if (!newMessage.guild) return;
        if (newMessage.author.bot) return;
        if (oldMessage.content == newMessage.content) return;

        const enabled = await SettingsHelper.GetSetting("event.message.update.enabled", newMessage.guild.id);
        if (!enabled || enabled.toLowerCase() != "true") return;

        const ignored = await IgnoredChannel.IsChannelIgnored(newMessage.channel.id);
        if (ignored) return;

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Message Deleted")
            .setDescription(`${newMessage.author} \`${newMessage.author.tag}\``)
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

    public override async messageCreate(message: Message) {
        if (!message.guild) return;
        if (message.author.bot) return;

        const isVerificationEnabled = await SettingsHelper.GetSetting("verification.enabled", message.guild.id);

        if (isVerificationEnabled && isVerificationEnabled.toLocaleLowerCase() == "true") {
            await OnMessage.VerificationCheck(message);
        }
    }
}