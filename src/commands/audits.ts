import { ICommandContext } from "../contracts/ICommandContext";
import Audit from "../entity/Audit";
import AuditTools from "../helpers/AuditTools";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";
import  SettingsHelper from "../helpers/SettingsHelper";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";

export default class Audits extends Command {
    constructor() {
        super();

        super.Category = "Moderation";
        super.Roles = [
            "moderator"
        ];
    }

    public override async execute(context: ICommandContext) {
        if (!context.message.guild) return;

        switch (context.args[0]) {
            case "user":
                await this.SendAuditForUser(context);
                break;
            case "view":
                await this.SendAudit(context);
                break;
            case "clear":
                await this.ClearAudit(context);
                break;
            case "add":
                await this.AddAudit(context);
                break;
            default:
                await this.SendUsage(context);
        }
    }

    private async SendUsage(context: ICommandContext) {
        const prefix = await SettingsHelper.GetServerPrefix(context.message.guild!.id);

        const description = [
            `\`${prefix}audits user <id>\` - Send the audits for this user`,
            `\`${prefix}audits view <id>\` - Send information about an audit`,
            `\`${prefix}audits clear <id>\` - Clears an audit for a user by audit id`,
            `\`${prefix}audits add <userid> <type> [reason]\` - Manually add an audit for a user`,
        ]

        const publicEmbed = new PublicEmbed(context, "Usage", description.join("\n"));
        await publicEmbed.SendToCurrentChannel();
    }

    private async SendAuditForUser(context: ICommandContext) {
        const userId = context.args[1];

        const audits = await Audit.FetchAuditsByUserId(userId, context.message.guild!.id);

        if (!audits || audits.length == 0) {
            const publicEmbed = new PublicEmbed(context, "", "There are no audits logged for this user.");
            await publicEmbed.SendToCurrentChannel();

            return;
        }

        const publicEmbed = new PublicEmbed(context, "Audit Log", "");

        for (let audit of audits) {
            publicEmbed.addField(`${audit.AuditId} // ${AuditTools.TypeToFriendlyText(audit.AuditType)}`, audit.WhenCreated.toString());
        }

        await publicEmbed.SendToCurrentChannel();
    }

    private async SendAudit(context: ICommandContext) {
        const auditId = context.args[1];

        if (!auditId) {
            await this.SendUsage(context);
            return;
        }

        const audit = await Audit.FetchAuditByAuditId(auditId.toUpperCase(), context.message.guild!.id);

        if (!audit) {
            const errorEmbed = new ErrorEmbed(context, "This audit can not be found.");
            await errorEmbed.SendToCurrentChannel();

            return;
        }

        const publicEmbed = new PublicEmbed(context, `Audit ${audit.AuditId.toUpperCase()}`, "");

        publicEmbed.addField("Reason", audit.Reason || "*none*", true);
        publicEmbed.addField("Type", AuditTools.TypeToFriendlyText(audit.AuditType), true);
        publicEmbed.addField("Moderator", `<@${audit.ModeratorId}>`, true);

        await publicEmbed.SendToCurrentChannel();
    }

    private async ClearAudit(context: ICommandContext) {
        const auditId = context.args[1];

        if (!auditId) {
            await this.SendUsage(context);
            return;
        }

        const audit = await Audit.FetchAuditByAuditId(auditId.toUpperCase(), context.message.guild!.id);

        if (!audit) {
            const errorEmbed = new ErrorEmbed(context, "This audit can not be found.");
            await errorEmbed.SendToCurrentChannel();

            return;
        }

        await Audit.Remove(Audit, audit);

        const publicEmbed = new PublicEmbed(context, "", "Audit cleared");
        await publicEmbed.SendToCurrentChannel();
    }

    private async AddAudit(context: ICommandContext) {
        const userId = context.args[1];
        const typeString = context.args[2];
        const reason = context.args.splice(3)
            .join(" ");
        
        if (!userId || !typeString) {
            await this.SendUsage(context);
            return;
        }

        const type = AuditTools.StringToType(typeString);

        const audit = new Audit(userId, type, reason, context.message.author.id, context.message.guild!.id);

        await audit.Save(Audit, audit);

        const publicEmbed = new PublicEmbed(context, "", `Created new audit with ID \`${audit.AuditId}\``);
        await publicEmbed.SendToCurrentChannel();
    }
}