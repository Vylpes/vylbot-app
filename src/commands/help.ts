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

    public override async execute(context: ICommandContext) {
        if (context.args.length == 0) {
            await this.SendAll(context);
        } else {
            await this.SendSingle(context);
        }
    }

    public async SendAll(context: ICommandContext) {
        const allCommands = CoreClient.commandItems
            .filter(x => !x.ServerId || x.ServerId == context.message.guild?.id);
        const cateogries = [...new Set(allCommands.map(x => x.Command.Category))];

        const embed = new PublicEmbed(context, "Commands", "");

        cateogries.forEach(category => {
            let filtered = allCommands.filter(x => x.Command.Category == category);

            embed.addField(StringTools.Capitalise(category || "Uncategorised"), StringTools.CapitaliseArray(filtered.flatMap(x => x.Name)).join(", "));
        });

        await embed.SendToCurrentChannel();
    }

    public async SendSingle(context: ICommandContext) {
        const command = CoreClient.commandItems.find(x => x.Name == context.args[0] && !x.ServerId);
        const exclusiveCommand = CoreClient.commandItems.find(x => x.Name == context.args[0] && x.ServerId == context.message.guild?.id);

        if (exclusiveCommand) {
            const embed = new PublicEmbed(context, StringTools.Capitalise(exclusiveCommand.Name), "");
            embed.addField("Category", StringTools.Capitalise(exclusiveCommand.Command.Category || "Uncategorised"));
            embed.addField("Required Roles", StringTools.Capitalise(exclusiveCommand.Command.Roles.join(", ")) || "Everyone");

            await embed.SendToCurrentChannel();
        } else if (command) {
            const embed = new PublicEmbed(context, StringTools.Capitalise(command.Name), "");
            embed.addField("Category", StringTools.Capitalise(command.Command.Category || "Uncategorised"));
            embed.addField("Required Roles", StringTools.Capitalise(command.Command.Roles.join(", ")) || "Everyone");

            await embed.SendToCurrentChannel();
        } else {
            const errorEmbed = new ErrorEmbed(context, "Command does not exist");
            await errorEmbed.SendToCurrentChannel();
        }
    }
}
