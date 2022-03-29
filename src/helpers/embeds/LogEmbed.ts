import { MessageEmbed, TextChannel, User } from "discord.js";
import ErrorMessages from "../../constants/ErrorMessages";
import { ICommandContext } from "../../contracts/ICommandContext";
import SettingsHelper from "../SettingsHelper";
import ErrorEmbed from "./ErrorEmbed";

export default class LogEmbed extends MessageEmbed {
    public context: ICommandContext;

    constructor(context: ICommandContext, title: string) {
        super();
        
        super.setColor(0x3050ba);
        super.setTitle(title);

        this.context = context;
    }

    // Detail methods
    public AddUser(title: string, user: User, setThumbnail: boolean = false) {
        this.addField(title, `${user} \`${user.tag}\``, true);

        if (setThumbnail) {
            this.setThumbnail(user.displayAvatarURL());
        }
    }

    public AddReason(message: String) {
        this.addField("Reason", message || "*none*");
    }

    // Send methods
    public SendToCurrentChannel() {
        this.context.message.channel.send(this);
    }

    public SendToChannel(name: string) {
        const channel = this.context.message.guild?.channels.cache
            .find(channel => channel.name == name) as TextChannel;
        
        if (!channel) {
            const errorEmbed = new ErrorEmbed(this.context, ErrorMessages.ChannelNotFound);
            errorEmbed.SendToCurrentChannel();
            return;
        }

        channel.send(this);
    }

    public async SendToMessageLogsChannel() {
        const channelName = await SettingsHelper.GetSetting("channels.logs.message", this.context.message.guild?.id!);

        if (!channelName) {
            return;
        }

        this.SendToChannel(channelName);
    }

    public async SendToMemberLogsChannel() {
        const channelName = await SettingsHelper.GetSetting("channels.logs.member", this.context.message.guild?.id!);

        if (!channelName) {
            return;
        }

        this.SendToChannel(channelName);
    }

    public async SendToModLogsChannel() {
        const channelName = await SettingsHelper.GetSetting("channels.logs.mod", this.context.message.guild?.id!);

        if (!channelName) {
            return;
        }

        this.SendToChannel(channelName);
    }
}