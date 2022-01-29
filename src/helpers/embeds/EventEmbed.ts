import { MessageEmbed, TextChannel, User, Guild } from "discord.js";

export default class EventEmbed extends MessageEmbed {
    public guild: Guild;

    constructor(guild: Guild, title: string) {
        super();
        
        super.setColor(process.env.EMBED_COLOUR!);
        super.setTitle(title);

        this.guild = guild;
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
    public SendToChannel(name: string) {
        const channel = this.guild.channels.cache
            .find(channel => channel.name == name) as TextChannel;
        
        if (!channel) {
            console.error(`Unable to find channel ${name}`);
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