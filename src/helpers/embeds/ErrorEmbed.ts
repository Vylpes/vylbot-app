import { MessageEmbed } from "discord.js";
import { ICommandContext } from "../../contracts/ICommandContext";

export default class ErrorEmbed extends MessageEmbed {
    public context: ICommandContext;

    constructor(context: ICommandContext, message: string) {
        super();
        
        super.setColor(0xd52803);
        super.setDescription(message);

        this.context = context;
    }

    public SendToCurrentChannel() {
        this.context.message.channel.send({ embeds: [ this ]});
    }
}