import { MessageEmbed, MessageOptions, Permissions, TextChannel } from "discord.js";
import { ICommandContext } from "../../contracts/ICommandContext";

export default class PublicEmbed extends MessageEmbed {
    public context: ICommandContext;

    constructor(context: ICommandContext, title: string, description: string) {
        super();
        
        super.setColor(0x3050ba);
        super.setTitle(title);
        super.setDescription(description);

        this.context = context;
    }

    // Detail methods
    public AddReason(message: string) {
        this.addField("Reason", message || "*none*");
    }

    // Send methods
    public async SendToCurrentChannel(options?: MessageOptions) {
        const channel = this.context.message.channel as TextChannel;
        const botMember = await this.context.message.guild?.members.fetch({ user: this.context.message.client.user! });

        if (!botMember) return;

        const permissions = channel.permissionsFor(botMember);

        if (!permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return;

        this.context.message.channel.send({ embeds: [ this ], ...options});
    }
}