import { CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { existsSync, readFileSync } from "fs";
import EmbedColours from "../constants/EmbedColours";
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

        super.CommandBuilder = new SlashCommandBuilder()
            .setName("rules")
            .setDescription("Send the rules embeds for this server")
            .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        if (!existsSync(`${process.cwd()}/data/rules/${interaction.guildId}.json`)) {
            await interaction.reply('Rules file doesn\'t exist.');
            return;
        }

        const rulesFile = readFileSync(`${process.cwd()}/data/rules/${interaction.guildId}.json`).toString();
        const rules = JSON.parse(rulesFile) as IRules[];

        const embeds: EmbedBuilder[] = [];

        rules.forEach(rule => {
            const embed = new EmbedBuilder()
                .setColor(EmbedColours.Ok)
                .setTitle(rule.title || "Rules")
                .setDescription(rule.description ? rule.description.join("\n") : "*none*");

            if (rule.image) {
                embed.setImage(rule.image);
            }

            if (rule.footer) {
                embed.setFooter({ text: rule.footer });
            }

            embeds.push(embed);
        });

        const channel = interaction.channel;

        if (!channel) {
            return;
        }

        await channel.send({ embeds: embeds });

        const successEmbed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Success")
            .setDescription("The rules have sent to this channel successfully");

        await interaction.reply({ embeds: [ successEmbed], ephemeral: true });
    }
}