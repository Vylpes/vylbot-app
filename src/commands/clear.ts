import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import { TextChannel } from "discord.js";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";
import { ICommandContext } from "../contracts/ICommandContext";
import ICommandReturnContext from "../contracts/ICommandReturnContext";

export default class Clear extends Command {
    constructor() {
        super();

        super.Category = "Moderation";
        super.Roles = [
            "moderator"
        ];
    }

    public override async execute(context: ICommandContext): Promise<ICommandReturnContext> {
        if (context.args.length == 0) {
            const errorEmbed = new ErrorEmbed(context, "Please specify an amount between 1 and 100");
            await errorEmbed.SendToCurrentChannel();

            return {
                commandContext: context,
                embeds: [errorEmbed]
            };
        }

        const totalToClear = Number.parseInt(context.args[0]);

        if (!totalToClear || totalToClear <= 0 || totalToClear > 100) {
            const errorEmbed = new ErrorEmbed(context, "Please specify an amount between 1 and 100");
            await errorEmbed.SendToCurrentChannel();
            return {
                commandContext: context,
                embeds: [errorEmbed]
            };
        }

        await (context.message.channel as TextChannel).bulkDelete(totalToClear);

        const embed = new PublicEmbed(context, "", `${totalToClear} message(s) were removed`);
        await embed.SendToCurrentChannel();

        return {
            commandContext: context,
            embeds: [embed]
        };
    }
}