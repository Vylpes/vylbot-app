import { MessageEmbed, TextChannel, User, Guild, Client, Permissions } from "discord.js";
import { ICommandContext } from "../../contracts/ICommandContext";
import SettingsHelper from "../SettingsHelper";

export default class EventEmbed extends MessageEmbed {
    public guild: Guild;

    private client: Client;

    constructor(client: Client, guild: Guild, title: string) {
        super();
        
        super.setColor(0x3050ba);
        super.setTitle(title);

        this.guild = guild;
        this.client = client;
    }

    // Detail methods
    public AddUser(title: string, user: User, setThumbnail: boolean = false) {
        this.addField(title, `${user} \`${user.tag}\``, true);

        if (setThumbnail) {
            this.setThumbnail(user.displayAvatarURL());
        }
    }

    public AddReason(message: string) {
        this.addField("Reason", message || "*none*");
    }

    // Send methods
    public async SendToChannel(name: string) {
        const channel = this.guild.channels.cache
            .find(channel => channel.name == name) as TextChannel;
        
        if (!channel) {
            console.error(`Unable to find channel ${name}`);
            return;
        }

        const botMember = await this.guild.members.fetch({ user: this.client.user! });

        if (!botMember) return;

        const permissions = channel.permissionsFor(botMember);

        if (!permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return;

        channel.send({embeds: [ this ]});
    }

    public async SendToMessageLogsChannel() {
        const channelName = await SettingsHelper.GetSetting("channels.logs.message", this.guild.id);

        if (!channelName) {
            return;
        }

        this.SendToChannel(channelName);
    }

    public async SendToMemberLogsChannel() {
        const channelName = await SettingsHelper.GetSetting("channels.logs.member", this.guild.id);

        if (!channelName) {
            return;
        }

        this.SendToChannel(channelName);
    }

    public async SendToModLogsChannel() {
        const channelName = await SettingsHelper.GetSetting("channels.logs.mod", this.guild.id);

        if (!channelName) {
            return;
        }

        this.SendToChannel(channelName);
    }
}