import { TextChannel, User, EmbedBuilder, PermissionsBitField, Message } from "discord.js";
import ErrorMessages from "../../constants/ErrorMessages";
import { ICommandContext } from "../../contracts/ICommandContext";
import SettingsHelper from "../SettingsHelper";
import ErrorEmbed from "./ErrorEmbed";

export default class LogEmbed {
    public context: ICommandContext;

    private _embedBuilder: EmbedBuilder;

    constructor(context: ICommandContext, title: string) {
        this._embedBuilder = new EmbedBuilder()
            .setColor(0x3050ba)
            .setTitle(title);

        this.context = context;
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
        ]);

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
    public async SendToCurrentChannel(): Promise<Message | undefined> {
        const channel = this.context.message.channel as TextChannel;
        const botMember = await this.context.message.guild?.members.fetch({ user: this.context.message.client.user! });

        if (!botMember) return;

        const permissions = channel.permissionsFor(botMember);

        if (!permissions.has(PermissionsBitField.Flags.SendMessages)) return;

        return this.context.message.channel.send({ embeds: [ this._embedBuilder ]});
    }

    public async SendToChannel(name: string): Promise<Message | undefined> {
        const channel = this.context.message.guild?.channels.cache
            .find(channel => channel.name == name) as TextChannel;
        
        if (!channel) {
            const errorEmbed = new ErrorEmbed(this.context, ErrorMessages.ChannelNotFound);
            errorEmbed.SendToCurrentChannel();

            return;
        }

        return await channel.send({ embeds: [ this._embedBuilder ]});
    }

    public async SendToMessageLogsChannel(): Promise<Message | undefined> {
        const channelName = await SettingsHelper.GetSetting("channels.logs.message", this.context.message.guild?.id!);

        if (!channelName) {
            return;
        }

        return this.SendToChannel(channelName);
    }

    public async SendToMemberLogsChannel(): Promise<Message | undefined> {
        const channelName = await SettingsHelper.GetSetting("channels.logs.member", this.context.message.guild?.id!);

        if (!channelName) {
            return;
        }

        return this.SendToChannel(channelName);
    }

    public async SendToModLogsChannel(): Promise<Message | undefined> {
        const channelName = await SettingsHelper.GetSetting("channels.logs.mod", this.context.message.guild?.id!);

        if (!channelName) {
            return;
        }

        return this.SendToChannel(channelName);
    }
}