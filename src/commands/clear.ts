import { Command, ICommandContext } from "vylbot-core";
import ErrorEmbed from "../helpers/ErrorEmbed";
import { TextChannel } from "discord.js";
import PublicEmbed from "../helpers/PublicEmbed";

export default class Clear extends Command {
    constructor() {
        super();

        super._category = "Moderation";
        super._roles = [
            process.env.ROLES_MODERATOR!
        ];
    }

    public override async execute(context: ICommandContext) {
        if (context.args.length == 0) {
            const errorEmbed = new ErrorEmbed(context, "Please specify an amount between 1 and 100");
            errorEmbed.SendToCurrentChannel();
            return;
        }

        const totalToClear = Number.parseInt(context.args[0]);

        if (!totalToClear || totalToClear <= 0 || totalToClear > 100) {
            const errorEmbed = new ErrorEmbed(context, "Please specify an amount between 1 and 100");
            errorEmbed.SendToCurrentChannel();
            return;
        }

        await (context.message.channel as TextChannel).bulkDelete(totalToClear);

        const embed = new PublicEmbed(context, "", `${totalToClear} message(s) were removed`);
        embed.SendToCurrentChannel();
    }
}