import { ICommandContext } from "../contracts/ICommandContext";
import Audit from "../entity/Audit";
import AuditTools from "../helpers/AuditTools";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";
import  SettingsHelper from "../helpers/SettingsHelper";

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
            default:
                await this.SendUsage(context);
        }
    }

    private async SendUsage(context: ICommandContext) {
        const prefix = await SettingsHelper.GetServerPrefix(context.message.guild!.id);

        const description = [
            `\`${prefix}audits user <id>\` - Send the audits for this user`,
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
}