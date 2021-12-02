import { existsSync, readFileSync } from "fs";
import { Command, ICommandContext } from "vylbot-core";
import ErrorEmbed from "../helpers/ErrorEmbed";
import PublicEmbed from "../helpers/PublicEmbed";

interface IRules {
    title?: string;
    description?: string[];
    image?: string;
    footer?: string;
}

export default class Rules extends Command {
    constructor() {
        super();

        super._category = "Admin";
        super._roles = [
            process.env.ROLES_MODERATOR!
        ];
    }

    public override execute(context: ICommandContext) {
        if (!existsSync(process.env.COMMANDS_RULES_FILE!)) {
            const errorEmbed = new ErrorEmbed(context, "Rules file doesn't exist");
            errorEmbed.SendToCurrentChannel();
            return;
        }

        const rulesFile = readFileSync(`${process.cwd()}/${process.env.COMMANDS_RULES_FILE}`).toString();
        const rules = JSON.parse(rulesFile) as IRules[];

        const embeds: PublicEmbed[] = [];
        
        rules.forEach(rule => {
            const embed = new PublicEmbed(context, rule.title || "", rule.description?.join("\n") || "");

            embed.setImage(rule.image || "");
            embed.setFooter(rule.footer || "");

            embeds.push(embed);
        });

        embeds.forEach(x => x.SendToCurrentChannel());
    }
}