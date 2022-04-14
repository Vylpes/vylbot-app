import ErrorMessages from "../constants/ErrorMessages";
import { ICommandContext } from "../contracts/ICommandContext";
import ICommandReturnContext from "../contracts/ICommandReturnContext";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import LogEmbed from "../helpers/embeds/LogEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class Mute extends Command {
    constructor() {
        super();

        super._category = "Moderation";
        super._roles = [
            "moderator"
        ];
    }

    public override async execute(context: ICommandContext): Promise<ICommandReturnContext> {
        const targetUser = context.message.mentions.users.first();

        if (!targetUser) {
            const embed = new ErrorEmbed(context, "User does not exist");
            embed.SendToCurrentChannel();
            
            return {
                commandContext: context,
                embeds: [embed]
            };
        }

        const targetMember = context.message.guild?.members.cache.find(x => x.user.id == targetUser.id);

        if (!targetMember) {
            const embed = new ErrorEmbed(context, "User is not in this server");
            embed.SendToCurrentChannel();
            
            return {
                commandContext: context,
                embeds: [embed]
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

        if (!targetMember.manageable) {
            const embed = new ErrorEmbed(context, ErrorMessages.InsufficientBotPermissions);
            embed.SendToCurrentChannel();
            
            return {
                commandContext: context,
                embeds: [embed]
            };
        }

        const logEmbed = new LogEmbed(context, "Member Muted");
        logEmbed.AddUser("User", targetUser, true)
        logEmbed.AddUser("Moderator", context.message.author);
        logEmbed.AddReason(reason);

        const publicEmbed = new PublicEmbed(context, "", `${targetUser} has been muted`);
        publicEmbed.AddReason(reason);

        const mutedRole = context.message.guild.roles.cache.find(role => role.name == process.env.ROLES_MUTED);

        if (!mutedRole) {
            const embed = new ErrorEmbed(context, ErrorMessages.RoleNotFound);
            embed.SendToCurrentChannel();
            
            return {
                commandContext: context,
                embeds: [embed]
            };
        }

        await targetMember.roles.add(mutedRole, `Moderator: ${context.message.author.tag}, Reason: ${reason || "*none*"}`);

        await logEmbed.SendToModLogsChannel();
        publicEmbed.SendToCurrentChannel();

        return {
            commandContext: context,
            embeds: [logEmbed, publicEmbed]
        };
    }
}