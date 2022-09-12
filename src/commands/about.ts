import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
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

        const embed = new PublicEmbed(context, "About", "Discord Bot made by Vylpes");

        embed.AddField("Version", process.env.BOT_VER!, true);
        embed.AddField("Author", process.env.BOT_AUTHOR!, true);
        embed.AddField("Date", process.env.BOT_DATE!, true);

        const row = new ActionRowBuilder<ButtonBuilder>();

        if (repoLink) {
            row.addComponents(
                new ButtonBuilder()
                    .setURL(repoLink)
                    .setLabel("Repo")
                    .setStyle(ButtonStyle.Link));
        }

        if (fundingLink) {
            row.addComponents(
                new ButtonBuilder()
                    .setURL(fundingLink)
                    .setLabel("Funding")
                    .setStyle(ButtonStyle.Link));
        }
        
        await embed.SendToCurrentChannel({ components: [ row ] });
    }
}