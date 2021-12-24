import { ICommandContext } from "../contracts/ICommandContext";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import LogEmbed from "../helpers/embeds/LogEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class Warn extends Command {
    constructor() {
        super();

        super._category = "Moderation";
        super._roles = [
            process.env.ROLES_MODERATOR!
        ];
    }

    public override execute(context: ICommandContext) {
        const user = context.message.mentions.users.first();

        if (!user) {
            const errorEmbed = new ErrorEmbed(context, "Please specify a valid user");
            errorEmbed.SendToCurrentChannel();
            return;
        }

        const member = context.message.guild?.member(user);

        if (!member) {
            const errorEmbed = new ErrorEmbed(context, "Please specify a valid user");
            errorEmbed.SendToCurrentChannel();
            return;
        }

        const reasonArgs = context.args;
        reasonArgs.splice(0, 1);

        const reason = reasonArgs.join(" ");

        if (!context.message.guild?.available) {
            return;
        }

        const logEmbed = new LogEmbed(context, "Member Warned");
        logEmbed.AddUser("User", user, true);
        logEmbed.AddUser("Moderator", context.message.author);
        logEmbed.AddReason(reason);

        const publicEmbed = new PublicEmbed(context, "", `${user} has been warned`);
        publicEmbed.AddReason(reason);

        logEmbed.SendToModLogsChannel();
        publicEmbed.SendToCurrentChannel();
    }
}