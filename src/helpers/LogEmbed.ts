import { MessageEmbed, TextChannel, User } from "discord.js";
import { ICommandContext } from "vylbot-core";
import ErrorMessages from "../constants/ErrorMessages";
import ErrorEmbed from "./ErrorEmbed";

export default class LogEmbed extends MessageEmbed {
    private _context: ICommandContext;

    constructor(context: ICommandContext, title: string) {
        super();
        
        super.setColor(process.env.EMBED_COLOUR!);
        super.setTitle(title);

        this._context = context;
    }

    // Detail methods
    public AddUser(title: string, user: User, setThumbnail: boolean = false) {
        super.addField(title, `${user} \`${user.tag}\``, true);

        if (setThumbnail) {
            super.setThumbnail(user.displayAvatarURL());
        }
    }

    public AddReason(message: String) {
        super.addField("Reason", message || "*none*");
    }

    // Send methods
    public SendToCurrentChannel() {
        this._context.message.channel.send(this);
    }

    public SendToChannel(name: string) {
        const channel = this._context.message.guild?.channels.cache
            .find(channel => channel.name == name) as TextChannel;
        
        if (!channel) {
            const errorEmbed = new ErrorEmbed(this._context, ErrorMessages.CantFindChannel);
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