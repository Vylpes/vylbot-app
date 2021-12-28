import { ICommandContext } from "../contracts/ICommandContext";
import ICommandReturnContext from "../contracts/ICommandReturnContext";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class Evaluate extends Command {
    constructor() {
        super();

        super._category = "Owner";
    }

    public override execute(context: ICommandContext): ICommandReturnContext {
        if (context.message.author.id != process.env.BOT_OWNERID) {
            return {
                commandContext: context,
                embeds: []
            };
        }

        const stmt = context.args;

        console.log(`Eval Statement: ${stmt.join(" ")}`);

        try {
            const result = eval(stmt.join(" "));

            const embed = new PublicEmbed(context, "", result);
            embed.SendToCurrentChannel();

            return {
                commandContext: context,
                embeds: [embed]
            };
        }
        catch (err: any) {
            const errorEmbed = new ErrorEmbed(context, err);
            errorEmbed.SendToCurrentChannel();

            return {
                commandContext: context,
                embeds: [errorEmbed]
            };
        }
    }
}