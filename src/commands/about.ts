import { MessageActionRow, MessageButton } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { ICommandContext } from "../contracts/ICommandContext";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class About extends Command {
    constructor() {
        super();
        super.Category = "General";
    }

    public override async execute(context: ICommandContext) {
        const fundingLink = process.env.ABOUT_FUNDING;
        const repoLink = process.env.ABOUT_REPO;

        const embed = new PublicEmbed(context, "About", "")
            .addField("Version", process.env.BOT_VER!, true)
            .addField("Author", process.env.BOT_AUTHOR!, true)
            .addField("Date", process.env.BOT_DATE!, true);

        const row = new MessageActionRow();

        if (repoLink) {
            row.addComponents(
                new MessageButton()
                    .setURL(repoLink)
                    .setLabel("Repo")
                    .setStyle(MessageButtonStyles.LINK));
        }

        if (fundingLink) {
            row.addComponents(
                new MessageButton()
                    .setURL(fundingLink)
                    .setLabel("Funding")
                    .setStyle(MessageButtonStyles.LINK));
        }
        
        await embed.SendToCurrentChannel({ components: [row] });
    }
}