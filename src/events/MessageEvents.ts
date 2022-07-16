import { Event } from "../type/event";
import { Message } from "discord.js";
import EventEmbed from "../helpers/embeds/EventEmbed";
import SettingsHelper from "../helpers/SettingsHelper";
import OnMessage from "./MessageEvents/OnMessage";
import IgnoredChannel from "../entity/IgnoredChannel";

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

        const embed = new EventEmbed(message.client, message.guild, "Message Deleted");
        embed.AddUser("User", message.author, true);
        embed.addField("Channel", message.channel.toString(), true);
        embed.addField("Content", `\`\`\`${message.content || "*none*"}\`\`\``);

        if (message.attachments.size > 0) {
            embed.addField("Attachments", `\`\`\`${message.attachments.map(x => x.url).join("\n")}\`\`\``);
        }

        const channel = await SettingsHelper.GetSetting("event.message.delete.channel", message.guild.id);
        if (!channel || !message.guild.channels.cache.find(x => x.name == channel)) return;

        await embed.SendToChannel(channel);
    }

    public override async messageUpdate(oldMessage: Message, newMessage: Message) {
        if (!newMessage.guild) return;
        if (newMessage.author.bot) return;
        if (oldMessage.content == newMessage.content) return;

        const enabled = await SettingsHelper.GetSetting("event.message.update.enabled", newMessage.guild.id);
        if (!enabled || enabled.toLowerCase() != "true") return;

        const ignored = await IgnoredChannel.IsChannelIgnored(newMessage.channel.id);
        if (ignored) return;

        const embed = new EventEmbed(newMessage.client, newMessage.guild, "Message Edited");
        embed.AddUser("User", newMessage.author, true);
        embed.addField("Channel", newMessage.channel.toString(), true);
        embed.addField("Before", `\`\`\`${oldMessage.content || "*none*"}\`\`\``);
        embed.addField("After", `\`\`\`${newMessage.content || "*none*"}\`\`\``);

        const channel = await SettingsHelper.GetSetting("event.message.update.channel", newMessage.guild.id);
        if (!channel || !newMessage.guild.channels.cache.find(x => x.name == channel)) return;

        await embed.SendToChannel(channel);
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