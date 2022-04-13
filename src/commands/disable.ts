import { ICommandContext } from "../contracts/ICommandContext";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import SettingsHelper from "../helpers/SettingsHelper";
import { Command } from "../type/command";

export default class Disable extends Command {
    constructor() {
        super();

        super._category = "Moderation";
        super._roles = [
            "moderator"
        ];
    }

    public override async execute(context: ICommandContext) {
        const action = context.args[0];

        switch (action) {
            case "add":
                await this.Add(context);
                break;
            case "remove":
                await this.Remove(context);
                break;
            default:
                await this.SendUsage(context);
        }
    }

    private async SendUsage(context: ICommandContext) {
        const description = [
            "USAGE: <add|remove> <name>",
            "",
            "add: Adds the command name to the server's disabled command string",
            "remove: Removes the command name from the server's disabled command string",
            "name: The name of the command to enable/disable"
        ].join("\n");
        
        const embed = new PublicEmbed(context, "", description);
        embed.SendToCurrentChannel();
    }

    private async Add(context: ICommandContext) {
        if (!context.message.guild) {
            return;
        }

        const commandName = context.args[1];

        if (!commandName) {
            this.SendUsage(context);
            return;
        }

        const disabledCommandsString = await SettingsHelper.GetSetting("commands.disabled", context.message.guild.id);
        const disabledCommands = disabledCommandsString != "" ? disabledCommandsString?.split(",") : [];

        disabledCommands?.push(commandName);

        await SettingsHelper.SetSetting("commands.disabled", context.message.guild.id, disabledCommands!.join(","));

        const embed = new PublicEmbed(context, "", `Disabled command: ${commandName}`);
        embed.SendToCurrentChannel();
    }

    private async Remove(context: ICommandContext) {
        if (!context.message.guild) {
            return;
        }

        const commandName = context.args[1];

        if (!commandName) {
            this.SendUsage(context);
            return;
        }

        const disabledCommandsString = await SettingsHelper.GetSetting("commands.disabled", context.message.guild.id);
        const disabledCommands = disabledCommandsString != "" ? disabledCommandsString?.split(",") : [];

        const disabledCommandsInstance = disabledCommands?.findIndex(x => x == commandName);

        if (disabledCommandsInstance! > -1) {
            disabledCommands?.splice(disabledCommandsInstance!, 1);
        }

        await SettingsHelper.SetSetting("commands.disabled", context.message.guild.id, disabledCommands!.join(","));

        const embed = new PublicEmbed(context, "", `Enabled command: ${commandName}`);
        embed.SendToCurrentChannel();
    }
}