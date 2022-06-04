import { MessageEmbed, Permissions, TextChannel } from "discord.js";
import { ICommandContext } from "../../contracts/ICommandContext";

export default class ErrorEmbed extends MessageEmbed {
    public context: ICommandContext;

    constructor(context: ICommandContext, message: string) {
        super();
        
        super.setColor(0xd52803);
        super.setDescription(message);

        this.context = context;
    }

    public async SendToCurrentChannel() {
        const channel = this.context.message.channel as TextChannel;
        const botMember = await this.context.message.guild?.members.fetch({ user: this.context.message.client.user! });

        if (!botMember) return;

        const permissions = channel.permissionsFor(botMember);

        if (!permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return;

        this.context.message.channel.send({ embeds: [ this ]});
    }
}