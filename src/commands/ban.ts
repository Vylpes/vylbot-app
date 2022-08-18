import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import ErrorMessages from "../constants/ErrorMessages";
import LogEmbed from "../helpers/embeds/LogEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";
import { ICommandContext } from "../contracts/ICommandContext";
import ICommandReturnContext from "../contracts/ICommandReturnContext";
import Audit from "../entity/Audit";
import { AuditType } from "../constants/AuditType";
import Server from "../entity/Server";

export default class Ban extends Command {
    constructor() {
        super();
        
        super.Category = "Moderation";
        super.Roles = [
            "moderator"
        ];
    }

    public override async execute(context: ICommandContext): Promise<ICommandReturnContext> {
        const targetUser = context.message.mentions.users.first();

        if (!targetUser) {
            const embed = new ErrorEmbed(context, "User does not exist");
            await embed.SendToCurrentChannel();

            return {
                commandContext: context,
                embeds: [embed],
            };
        }

        const targetMember = context.message.guild?.members.cache.find(x => x.user.id == targetUser.id);

        if (!targetMember) {
            const embed = new ErrorEmbed(context, "User is not in this server");
            await embed.SendToCurrentChannel();

            return {
                commandContext: context,
                embeds: [embed],
            };
        }

        const reasonArgs = context.args;
        reasonArgs.splice(0, 1)
        
        const reason = reasonArgs.join(" ");
        
        if (!context.message.guild?.available) {
            return {
                commandContext: context,
                embeds: [],
            };
        }

        if (!targetMember.bannable) {
            const embed = new ErrorEmbed(context, ErrorMessages.InsufficientBotPermissions);
            await embed.SendToCurrentChannel();

            return {
                commandContext: context,
                embeds: [embed],
            };
        }

        const logEmbed = new LogEmbed(context, "Member Banned");
        logEmbed.AddUser("User", targetUser, true);
        logEmbed.AddUser("Moderator", context.message.author);
        logEmbed.AddReason(reason);

        const publicEmbed = new PublicEmbed(context, "", `${targetUser} has been banned`);

        await targetMember.ban({ reason: `Moderator: ${context.message.author.tag}, Reason: ${reason || "*none*"}` });

        await logEmbed.SendToModLogsChannel();
        await publicEmbed.SendToCurrentChannel();

        if (context.message.guild) {
            const server = await Server.FetchOneById(Server, context.message.guild.id);

            if (server) {
                const audit = new Audit(targetUser.id, AuditType.Ban, reason, context.message.author.id, context.message.guild.id);

                await audit.Save(Audit, audit);
            }
        }

        return {
            commandContext: context,
            embeds: [logEmbed, publicEmbed],
        };
    }
}