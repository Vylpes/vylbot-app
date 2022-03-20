import { Event } from "../type/event";
import { Message } from "discord.js";
import EventEmbed from "../helpers/embeds/EventEmbed";
import IEventReturnContext from "../contracts/IEventReturnContext";
import SettingsHelper from "../helpers/SettingsHelper";
import OnMessage from "./MessageEvents/OnMessage";

export default class MessageEvents extends Event {
    constructor() {
        super();
    }

    public override async messageDelete(message: Message): Promise<IEventReturnContext> {
        if (!message.guild) {
            return {
                embeds: []
            };
        }

        if (message.author.bot) {
            return {
                embeds: []
            };
        }

        const embed = new EventEmbed(message.guild, "Message Deleted");
        embed.AddUser("User", message.author, true);
        embed.addField("Channel", message.channel, true);
        embed.addField("Content", `\`\`\`${message.content || "*none*"}\`\`\``);

        if (message.attachments.size > 0) {
            embed.addField("Attachments", `\`\`\`${message.attachments.map(x => x.url).join("\n")}\`\`\``);
        }

        await embed.SendToMessageLogsChannel();

        return {
            embeds: [embed]
        };
    }

    public override async messageUpdate(oldMessage: Message, newMessage: Message): Promise<IEventReturnContext> {
        if (!newMessage.guild){
            return {
                embeds: []
            };
        }

        if (newMessage.author.bot) {
            return {
                embeds: []
            };
        }

        if (oldMessage.content == newMessage.content) {
            return {
                embeds: []
            };
        }

        const embed = new EventEmbed(newMessage.guild, "Message Edited");
        embed.AddUser("User", newMessage.author, true);
        embed.addField("Channel", newMessage.channel, true);
        embed.addField("Before", `\`\`\`${oldMessage.content || "*none*"}\`\`\``);
        embed.addField("After", `\`\`\`${newMessage.content || "*none*"}\`\`\``);

        await embed.SendToMessageLogsChannel();

        return {
            embeds: [embed]
        };
    }

    public override async message(message: Message) {
        if (!message.guild) return;
        if (message.author.bot) return;

        const isVerificationEnabled = await SettingsHelper.GetSetting("verification.enabled", message.guild.id);

        if (isVerificationEnabled && isVerificationEnabled.toLocaleLowerCase() == "true") {
            await OnMessage.VerificationCheck(message);
        }
    }
}