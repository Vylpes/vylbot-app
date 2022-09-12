import { AuditType } from "../constants/AuditType";
import { ICommandContext } from "../contracts/ICommandContext";
import Audit from "../entity/Audit";
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

    public override async execute(context: ICommandContext) {
        const user = context.message.mentions.users.first();

        if (!user) {
            const errorEmbed = new ErrorEmbed(context, "User does not exist");
            await errorEmbed.SendToCurrentChannel();
            
            return;
        }

        const member = context.message.guild?.members.cache.find(x => x.user.id == user.id);

        if (!member) {
            const errorEmbed = new ErrorEmbed(context, "User is not in this server");
            await errorEmbed.SendToCurrentChannel();
            
            return;
        }

        const reasonArgs = context.args;
        reasonArgs.splice(0, 1);

        const reason = reasonArgs.join(" ");

        if (!context.message.guild?.available) return;

        const logEmbed = new LogEmbed(context, "Member Warned");
        logEmbed.AddUser("User", user, true);
        logEmbed.AddUser("Moderator", context.message.author);
        logEmbed.AddReason(reason);

        const publicEmbed = new PublicEmbed(context, "", `${user} has been warned`);
        publicEmbed.AddReason(reason);

        await logEmbed.SendToModLogsChannel();
        await publicEmbed.SendToCurrentChannel();
        
        if (context.message.guild) {
            const audit = new Audit(user.id, AuditType.Warn, reason, context.message.author.id, context.message.guild.id);

            await audit.Save(Audit, audit);
        }
    }
}