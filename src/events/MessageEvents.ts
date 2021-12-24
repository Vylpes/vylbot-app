import { Event } from "../type/event";
import { Message } from "discord.js";
import EventEmbed from "../helpers/embeds/EventEmbed";

export default class MessageEvents extends Event {
    constructor() {
        super();
    }

    public override messageDelete(message: Message) {
        if (!message.guild) return;
        if (message.author.bot) return;

        const embed = new EventEmbed(message.guild, "Message Deleted");
        embed.AddUser("User", message.author, true);
        embed.addField("Channel", message.channel, true);
        embed.addField("Content", `\`\`\`${message.content || "*none*"}\`\`\``);
        embed.addField("Attachments", `\`\`\`${message.attachments.map(x => x.url).join("\n")}`);

        embed.SendToMessageLogsChannel();
    }

    public override messageUpdate(oldMessage: Message, newMessage: Message) {
        if (!newMessage.guild) return;
        if (newMessage.author.bot) return;
        if (oldMessage.content == newMessage.content) return;

        const embed = new EventEmbed(newMessage.guild, "Message Edited");
        embed.AddUser("User", newMessage.author, true);
        embed.addField("Channel", newMessage.channel, true);
        embed.addField("Before", `\`\`\`${oldMessage.content || "*none*"}\`\`\``);
        embed.addField("After", `\`\`\`${newMessage.content || "*none*"}\`\`\``);

        embed.SendToMessageLogsChannel();
    }
}