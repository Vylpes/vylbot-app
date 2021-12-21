import ErrorMessages from "../constants/ErrorMessages";
import { ICommandContext } from "../contracts/ICommandContext";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import LogEmbed from "../helpers/embeds/LogEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class Kick extends Command {
    constructor() {
        super();

        super._category = "Moderation";
        super._roles = [
            process.env.ROLES_MODERATOR!
        ];
    }

    public override async execute(context: ICommandContext) {
        const targetUser = context.message.mentions.users.first();

        if (!targetUser) {
            const embed = new ErrorEmbed(context, "User does not exist");
            embed.SendToCurrentChannel();
            return;
        }

        const targetMember = context.message.guild?.member(targetUser);

        if (!targetMember) {
            const embed = new ErrorEmbed(context, "User is not in this server");
            embed.SendToCurrentChannel();
            return;
        }

        const reasonArgs = context.args;
        reasonArgs.splice(0, 1)
        
        const reason = reasonArgs.join(" ");
        
        if (!context.message.guild?.available) {
            return;
        }

        if (!targetMember.kickable) {
            const embed = new ErrorEmbed(context, ErrorMessages.InsufficientBotPermissions);
            embed.SendToCurrentChannel();
            return;
        }

        const logEmbed = new LogEmbed(context, "Member Kicked");
        logEmbed.AddUser("User", targetUser, true);
        logEmbed.AddUser("Moderator", context.message.author);
        logEmbed.AddReason(reason);

        const publicEmbed = new PublicEmbed(context, "", `${targetUser} has been kicked`);

        await targetMember.kick(reason);

        logEmbed.SendToModLogsChannel();
        publicEmbed.SendToCurrentChannel();
    }
}