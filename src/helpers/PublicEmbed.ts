import { MessageEmbed } from "discord.js";
import { ICommandContext } from "vylbot-core";

export default class PublicEmbed extends MessageEmbed {
    private _context: ICommandContext;

    constructor(context: ICommandContext, title: string, description: string) {
        super();
        
        super.setColor(process.env.ERROR_EMBED!);
        super.setTitle(title);
        super.setDescription(description);

        this._context = context;
    }

    // Send methods
    public SendToCurrentChannel() {
        this._context.message.channel.send(this);
    }
}