import { MessageEmbed } from "discord.js";
import { ICommandContext } from "vylbot-core";

export default class PublicEmbed extends MessageEmbed {
    private _context: ICommandContext;

    constructor(context: ICommandContext, title: string, description: string) {
        super();
        
        super.setColor(process.env.EMBED_COLOUR!);
        super.setTitle(title);
        super.setDescription(description);

        this._context = context;
    }

    // Detail methods
    public AddReason(message: String) {
        super.addField("Reason", message || "*none*");
    }

    // Send methods
    public SendToCurrentChannel() {
        this._context.message.channel.send(this);
    }
}