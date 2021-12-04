import { existsSync, readdirSync } from "fs";
import { Command, ICommandContext } from "vylbot-core";
import ErrorEmbed from "../helpers/ErrorEmbed";
import PublicEmbed from "../helpers/PublicEmbed";
import StringTools from "../helpers/StringTools";

interface ICommandData {
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

    public override execute(context: ICommandContext) {
        if (context.args.length == 0) {
            this.SendAll(context);
        } else {
            this.SendSingle(context);
        }
    }

    private SendAll(context: ICommandContext) {
        const allCommands = this.GetAllCommandData();
        const cateogries = this.DetermineCategories(allCommands);

        const embed = new PublicEmbed(context, "Commands", "");

        cateogries.forEach(category => {
            let filtered = allCommands.filter(x => x.Category == category);

            embed.addField(StringTools.Capitalise(category), filtered.flatMap(x => x.Name).join(", "));
        });

        embed.SendToCurrentChannel();
    }

    private SendSingle(context: ICommandContext) {
        const command = this.GetCommandData(context.args[0]);

        if (!command.Exists) {
            const errorEmbed = new ErrorEmbed(context, "Command does not exist");
            errorEmbed.SendToCurrentChannel();
            return;
        }

        const embed = new PublicEmbed(context, StringTools.Capitalise(command.Name!), "");
        embed.addField("Category", StringTools.Capitalise(command.Category!));
        embed.addField("Required Roles", StringTools.Capitalise(command.Roles!.join(", ")) || "*none*");

        embed.SendToCurrentChannel();
    }

    private GetAllCommandData(): ICommandData[] {
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

    private GetCommandData(name: string): ICommandData {
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

    private DetermineCategories(commands: ICommandData[]): string[] {
        const result: string[] = [];

        commands.forEach(cmd => {
            if (!result.includes(cmd.Category!)) {
                result.push(cmd.Category!);
            }
        });

        return result;
    }
}