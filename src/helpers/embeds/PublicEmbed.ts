import { MessageEmbed } from "discord.js";
import { ICommandContext } from "../../contracts/ICommandContext";

export default class PublicEmbed extends MessageEmbed {
    public context: ICommandContext;

    constructor(context: ICommandContext, title: string, description: string) {
        super();
        
        super.setColor(process.env.EMBED_COLOUR!);
        super.setTitle(title);
        super.setDescription(description);

        this.context = context;
    }

    // Detail methods
    public AddReason(message: String) {
        this.addField("Reason", message || "*none*");
    }

    // Send methods
    public SendToCurrentChannel() {
        this.context.message.channel.send(this);
    }
}