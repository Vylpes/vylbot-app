import { MessageEmbed, TextChannel, User } from "discord.js";
import ErrorMessages from "../../constants/ErrorMessages";
import { ICommandContext } from "../../contracts/ICommandContext";
import ErrorEmbed from "./ErrorEmbed";

export default class LogEmbed extends MessageEmbed {
    public context: ICommandContext;

    constructor(context: ICommandContext, title: string) {
        super();
        
        super.setColor(process.env.EMBED_COLOUR!);
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

    public SendToMessageLogsChannel() {
        this.SendToChannel(process.env.CHANNELS_LOGS_MESSAGE!)
    }

    public SendToMemberLogsChannel() {
        this.SendToChannel(process.env.CHANNELS_LOGS_MEMBER!)
    }

    public SendToModLogsChannel() {
        this.SendToChannel(process.env.CHANNELS_LOGS_MOD!)
    }
}