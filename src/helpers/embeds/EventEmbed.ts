import { EmbedBuilder, TextChannel, User, Guild, Client, PermissionsBitField, Message } from "discord.js";
import SettingsHelper from "../SettingsHelper";

export default class EventEmbed {
    public guild: Guild;
    
    private client: Client;
    private _embedBuilder: EmbedBuilder;

    constructor(client: Client, guild: Guild, title: string) {
        this._embedBuilder = new EmbedBuilder()
            .setColor(0x3050ba)
            .setTitle(title);

        this.guild = guild;
        this.client = client;
    }

    // Detail methods
    public AddField(name: string, value: string, inline: boolean = false) {
        this._embedBuilder.addFields([
            {
                name,
                value,
                inline
            }
        ])
    }

    public SetFooter(text: string) {
        this._embedBuilder.setFooter({
            text
        });
    }

    public SetImage(imageUrl: string) {
        this._embedBuilder.setImage(imageUrl);
    }

    public AddUser(title: string, user: User, setThumbnail: boolean = false) {
        this._embedBuilder.addFields([
            {
                name: title,
                value: `${user} \`${user.tag}\``,
                inline: true,
            }
        ])

        if (setThumbnail) {
            this._embedBuilder.setThumbnail(user.displayAvatarURL());
        }
    }

    public AddReason(message: string) {
        this._embedBuilder.addFields([
            {
                name: "Reason",
                value: message || "*none*",
            }
        ])
    }

    public SetURL(url: string) {
        this._embedBuilder.setURL(url);
    }

    // Send methods
    public async SendToChannel(name: string): Promise<Message | undefined> {
        const channel = this.guild.channels.cache
            .find(channel => channel.name == name) as TextChannel;
        
        if (!channel) {
            console.error(`Unable to find channel ${name}`);
            return;
        }

        const botMember = await this.guild.members.fetch({ user: this.client.user! });

        if (!botMember) return;

        const permissions = channel.permissionsFor(botMember);

        if (!permissions.has(PermissionsBitField.Flags.SendMessages)) return;

        return channel.send({embeds: [ this._embedBuilder ]});
    }

    public async SendToMessageLogsChannel(): Promise<Message | undefined> {
        const channelName = await SettingsHelper.GetSetting("channels.logs.message", this.guild.id);

        if (!channelName) {
            return;
        }

        return this.SendToChannel(channelName);
    }

    public async SendToMemberLogsChannel(): Promise<Message | undefined> {
        const channelName = await SettingsHelper.GetSetting("channels.logs.member", this.guild.id);

        if (!channelName) {
            return;
        }

        return this.SendToChannel(channelName);
    }

    public async SendToModLogsChannel(): Promise<Message | undefined> {
        const channelName = await SettingsHelper.GetSetting("channels.logs.mod", this.guild.id);

        if (!channelName) {
            return;
        }

        return this.SendToChannel(channelName);
    }
}