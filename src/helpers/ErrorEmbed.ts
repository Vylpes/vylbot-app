import { MessageEmbed } from "discord.js";
import { ICommandContext } from "vylbot-core";

export default class ErrorEmbed extends MessageEmbed {
    private _context: ICommandContext;

    constructor(context: ICommandContext, message: String) {
        super();
        
        super.setColor(process.env.EMBED_COLOUR_ERROR!);
        super.setDescription(message);

        this._context = context;
    }

    public SendToCurrentChannel() {
        this._context.message.channel.send(this);
    }
}