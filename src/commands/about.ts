import { ICommandContext } from "../contracts/ICommandContext";
import ICommandReturnContext from "../contracts/ICommandReturnContext";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class About extends Command {
    constructor() {
        super();
        super._category = "General";
    }

    public override execute(context: ICommandContext): ICommandReturnContext {
        const embed = new PublicEmbed(context, "About", "")
            .addField("Version", process.env.BOT_VER!)
            .addField("Author", process.env.BOT_AUTHOR!)
            .addField("Date", process.env.BOT_DATE!);
        
        embed.SendToCurrentChannel();

        return {
            commandContext: context,
            embeds: [embed]
        };
    }
}