import { existsSync, readdirSync } from "fs";
import { ICommandContext } from "../contracts/ICommandContext";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import StringTools from "../helpers/StringTools";
import ICommandReturnContext from "../contracts/ICommandReturnContext";
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

        super._category = "General";
    }

    public override execute(context: ICommandContext): ICommandReturnContext {
        if (context.args.length == 0) {
            return this.SendAll(context);
        } else {
            return this.SendSingle(context);
        }
    }

    public SendAll(context: ICommandContext): ICommandReturnContext {
        const allCommands = this.GetAllCommandData();
        const cateogries = [...new Set(allCommands.map(x => x.Category!))];;

        const embed = new PublicEmbed(context, "Commands", "");

        cateogries.forEach(category => {
            let filtered = allCommands.filter(x => x.Category == category);

            embed.addField(StringTools.Capitalise(category), filtered.flatMap(x => x.Name).join(", "));
        });

        embed.SendToCurrentChannel();

	return {
		commandContext: context,
		embeds: [ embed ]
	};
    }

    public SendSingle(context: ICommandContext): ICommandReturnContext {
        const command = this.GetCommandData(context.args[0]);

        if (!command.Exists) {
            const errorEmbed = new ErrorEmbed(context, "Command does not exist");
            errorEmbed.SendToCurrentChannel();
	    
            return {
		    commandContext: context,
		    embeds: [ errorEmbed ]
	    };
        }

        const embed = new PublicEmbed(context, StringTools.Capitalise(command.Name!), "");
        embed.addField("Category", StringTools.Capitalise(command.Category!));
        embed.addField("Required Roles", StringTools.Capitalise(command.Roles!.join(", ")) || "*none*");

        embed.SendToCurrentChannel();

	return {
		commandContext: context,
		embeds: [ embed ]
	};
    }

    public GetAllCommandData(): ICommandData[] {
        const result: ICommandData[] = [];

        const folder = process.env.FOLDERS_COMMANDS!;

        const contents = readdirSync(`${process.cwd()}/${folder}`);

        contents.forEach(name => {
            const file = require(`${process.cwd()}/${folder}/${name}`).default;
            const command = new file() as Command;

            const data: ICommandData = {
                Exists: true,
                Name: name.replace(".ts", ""),
                Category: command._category || "none",
                Roles: command._roles,
            };

            result.push(data);
        });

        return result;
    }

    public GetCommandData(name: string): ICommandData {
        const folder = process.env.FOLDERS_COMMANDS!;
        const path = `${process.cwd()}/${folder}/${name}.ts`;

        if (!existsSync(path)) {
            return {
                Exists: false
            };
        }

        const file = require(path).default;
        const command = new file() as Command;

        const data: ICommandData = {
            Exists: true,
            Name: name,
            Category: command._category || "none",
            Roles: command._roles
        };

        return data;
    }
}
