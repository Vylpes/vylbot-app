import { Command, ICommandContext } from "vylbot-core";
import { MessageEmbed } from "discord.js";

export default class About extends Command {
    constructor() {
        super();
        super._category = "General";
    }

    public override execute(context: ICommandContext) {
        const embed = new MessageEmbed()
            .setTitle("About")
            .setColor(process.env.EMBED_COLOUR!)
            .setDescription("About the bot")
            .addField("Version", process.env.BOT_VER)
            .addField("VylBot Core", process.env.CORE_VER)
            .addField("Author", process.env.BOT_AUTHOR)
            .addField("Date", process.env.BOT_DATE);
        
        context.message.channel.send(embed);
    }
}