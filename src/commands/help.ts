import { existsSync, readdirSync } from "fs";
import { CoreClient } from "../client/client";
import { ICommandContext } from "../contracts/ICommandContext";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import StringTools from "../helpers/StringTools";
import { Command } from "../type/command";

export interface ICommandData {
    Exists: boolean;
    Name?: string;
    Category?: string;
    Roles?: string[];
}

export default class Help extends Command {
    constructor() {
        super();

        super.Category = "General";
    }

    public override execute(context: ICommandContext) {
        if (context.args.length == 0) {
            this.SendAll(context);
        } else {
            this.SendSingle(context);
        }
    }

    public SendAll(context: ICommandContext) {
        const allCommands = CoreClient.commandItems;
        const cateogries = [...new Set(allCommands.map(x => x.Command.Category))];;

        const embed = new PublicEmbed(context, "Commands", "");

        cateogries.forEach(category => {
            let filtered = allCommands.filter(x => x.Command.Category == category);

            embed.addField(StringTools.Capitalise(category || "Uncategorised"), StringTools.CapitaliseArray(filtered.flatMap(x => x.Name)).join(", "));
        });

        embed.SendToCurrentChannel();
    }

    public SendSingle(context: ICommandContext) {
        const command = CoreClient.commandItems.find(x => x.Name == context.args[0]);

        if (!command) {
            const errorEmbed = new ErrorEmbed(context, "Command does not exist");
            errorEmbed.SendToCurrentChannel();

            return;
        }

        const embed = new PublicEmbed(context, StringTools.Capitalise(command.Name), "");
        embed.addField("Category", StringTools.Capitalise(command.Command.Category || "Uncategorised"));
        embed.addField("Required Roles", StringTools.Capitalise(command.Command.Roles.join(", ")) || "Everyone");

        embed.SendToCurrentChannel();
    }
}
