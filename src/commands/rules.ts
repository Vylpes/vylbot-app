import { existsSync, readFileSync } from "fs";
import { ICommandContext } from "../contracts/ICommandContext";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

interface IRules {
    title?: string;
    description?: string[];
    image?: string;
    footer?: string;
}

export default class Rules extends Command {
    constructor() {
        super();

        super.Category = "Admin";
        super.Roles = [
            "administrator"
        ];
    }

    public override async execute(context: ICommandContext) {
        if (!existsSync(`${process.cwd()}/data/rules/${context.message.guild?.id}.json`)) {
            const errorEmbed = new ErrorEmbed(context, "Rules file doesn't exist");
            await errorEmbed.SendToCurrentChannel();

            return;
        }

        const rulesFile = readFileSync(`${process.cwd()}/data/rules/${context.message.guild?.id}.json`).toString();
        const rules = JSON.parse(rulesFile) as IRules[];

        const embeds: PublicEmbed[] = [];
        
        rules.forEach(rule => {
            const embed = new PublicEmbed(context, rule.title || "", rule.description?.join("\n") || "");

            embed.SetImage(rule.image || "");
            embed.SetFooter(rule.footer || "");

            embeds.push(embed);
        });

        for (let i = 0; i < embeds.length; i++) {
            const embed = embeds[i];

            await embed.SendToCurrentChannel();
        }
    }
}