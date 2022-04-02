import { ICommandContext } from "../../contracts/ICommandContext";
import PublicEmbed from "../../helpers/embeds/PublicEmbed";
import SettingsHelper from "../../helpers/SettingsHelper";
import { Command } from "../../type/command";

export default class Entry extends Command {
    constructor() {
        super();

        super._category = "Moderation";
        super._roles = [
            "moderator"
        ];
    }

    public override async execute(context: ICommandContext) {
        if (!context.message.guild) return;

        const rulesChannelId = await SettingsHelper.GetSetting("channels.rules", context.message.guild.id) || "rules";

        const embedInfo = new PublicEmbed(context, "", `Welcome to the server! Please make sure to read the rules in the <#${rulesChannelId}> channel and type the code found there in here to proceed to the main part of the server.`);

        embedInfo.SendToCurrentChannel();
    }
}