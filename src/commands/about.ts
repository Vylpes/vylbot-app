import { ICommandContext } from "../contracts/ICommandContext";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class About extends Command {
    constructor() {
        super();
        super.Category = "General";
    }

    public override async execute(context: ICommandContext) {
        const embed = new PublicEmbed(context, "About", "")
            .addField("Version", process.env.BOT_VER!)
            .addField("Author", process.env.BOT_AUTHOR!)
            .addField("Date", process.env.BOT_DATE!);
        
        await embed.SendToCurrentChannel();
    }
}