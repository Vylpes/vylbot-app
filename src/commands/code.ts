import { CommandResponse } from "../constants/CommandResponse";
import { ICommandContext } from "../contracts/ICommandContext";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import SettingsHelper from "../helpers/SettingsHelper";
import StringTools from "../helpers/StringTools";
import { Command } from "../type/command";

export default class Code extends Command {
    constructor() {
        super();

        super.Category = "Moderation";
        super.Roles = [
            "moderator"
        ];
    }

    public override async precheckAsync(context: ICommandContext): Promise<CommandResponse> {
        if (!context.message.guild){
            return CommandResponse.NotInServer;
        }

        const isEnabled = await SettingsHelper.GetSetting("verification.enabled", context.message.guild?.id);

        if (!isEnabled) {
            return CommandResponse.FeatureDisabled;
        }

        if (isEnabled.toLocaleLowerCase() != 'true') {
            return CommandResponse.FeatureDisabled;
        }

        return CommandResponse.Ok;
    }

    public override async execute(context: ICommandContext) {
        const action = context.args[0];

        switch (action) {
            case "randomise":
                await this.Randomise(context);
                break;
            case "embed":
                await this.SendEmbed(context);
                break;
            default:
                await this.SendUsage(context);
        }
    }

    private async SendUsage(context: ICommandContext) {
        const description = [
            "USAGE: <randomise|embed>",
            "",
            "randomise: Sets the server's entry code to a random code",
            "embed: Sends an embed with the server's entry code"
        ].join("\n");
        
        const embed = new PublicEmbed(context, "", description);
        await embed.SendToCurrentChannel();
    }

    private async Randomise(context: ICommandContext) {
        if (!context.message.guild) {
            return;
        }

        const randomCode = StringTools.RandomString(5);

        await SettingsHelper.SetSetting("verification.code", context.message.guild.id, randomCode);

        const embed = new PublicEmbed(context, "Code", `Entry code has been set to \`${randomCode}\``);
        await embed.SendToCurrentChannel();
    }

    private async SendEmbed(context: ICommandContext) {
        if (!context.message.guild) {
            return;
        }

        const code = await SettingsHelper.GetSetting("verification.code", context.message.guild.id);

        if (!code || code == "") {
            const errorEmbed = new ErrorEmbed(context, "There is no code for this server setup.");
            errorEmbed.SendToCurrentChannel();

            return;
        }

        const embed = new PublicEmbed(context, "Entry Code", code!);
        await embed.SendToCurrentChannel();
    }
}