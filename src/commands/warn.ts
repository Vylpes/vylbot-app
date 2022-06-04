import { ICommandContext } from "../contracts/ICommandContext";
import ICommandReturnContext from "../contracts/ICommandReturnContext";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import LogEmbed from "../helpers/embeds/LogEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class Warn extends Command {
    constructor() {
        super();

        super.Category = "Moderation";
        super.Roles = [
            "moderator"
        ];
    }

    public override async execute(context: ICommandContext): Promise<ICommandReturnContext> {
        const user = context.message.mentions.users.first();

        if (!user) {
            const errorEmbed = new ErrorEmbed(context, "User does not exist");
            await errorEmbed.SendToCurrentChannel();
            
            return {
                commandContext: context,
                embeds: [errorEmbed]
            };
        }

        const member = context.message.guild?.members.cache.find(x => x.user.id == user.id);

        if (!member) {
            const errorEmbed = new ErrorEmbed(context, "User is not in this server");
            await errorEmbed.SendToCurrentChannel();
            
            return {
                commandContext: context,
                embeds: [errorEmbed]
            };
        }

        const reasonArgs = context.args;
        reasonArgs.splice(0, 1);

        const reason = reasonArgs.join(" ");

        if (!context.message.guild?.available) {
            return {
                commandContext: context,
                embeds: []
            };
        }

        const logEmbed = new LogEmbed(context, "Member Warned");
        logEmbed.AddUser("User", user, true);
        logEmbed.AddUser("Moderator", context.message.author);
        logEmbed.AddReason(reason);

        const publicEmbed = new PublicEmbed(context, "", `${user} has been warned`);
        publicEmbed.AddReason(reason);

        await logEmbed.SendToModLogsChannel();
        await publicEmbed.SendToCurrentChannel();

        return {
            commandContext: context,
            embeds: [logEmbed, publicEmbed]
        };
    }
}