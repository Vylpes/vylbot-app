import { MessageEmbed } from "discord.js";
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
    public SendToCurrentChannel() {
        this.context.message.channel.send({ embeds: [ this ]});
    }
}