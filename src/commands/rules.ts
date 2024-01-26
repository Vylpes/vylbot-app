import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { existsSync, readFileSync } from "fs";
import EmbedColours from "../constants/EmbedColours";
import { Command } from "../type/command";
import SettingsHelper from "../helpers/SettingsHelper";

interface IRules {
    title?: string;
    description?: string[];
    image?: string;
    footer?: string;
}

export default class Rules extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName('rules')
            .setDescription("Rules-related commands")
            .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
            .addSubcommand(x =>
                x
                    .setName('embeds')
                    .setDescription('Send the rules embeds for this server'))
            .addSubcommand(x =>
                x
                    .setName('access')
                    .setDescription('Send the server verification embed button'));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.options.getSubcommand()) {
            case "embeds":
                await this.SendEmbeds(interaction);
                break;
            case "access":
                await this.SendAccessButton(interaction);
                break;
            default:
                await interaction.reply("Subcommand doesn't exist.");
        }
    }

    private async SendEmbeds(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        if (!existsSync(`${process.cwd()}/data/rules/${interaction.guildId}.json`)) {
            await interaction.reply('Rules file doesn\'t exist.');
            return;
        }

        const rulesFile = readFileSync(`${process.cwd()}/data/rules/${interaction.guildId}.json`).toString();
        const rules = JSON.parse(rulesFile) as IRules[];

        const embeds: EmbedBuilder[] = [];

        if (rules.length == 0) {
            await interaction.reply({ content: "No rules have been supplied within code base for this server.", ephemeral: true });
            return;
        }

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
            await interaction.reply({ content: "Channel not found.", ephemeral: true });
            return;
        }

        await channel.send({ embeds: embeds });

        const successEmbed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Success")
            .setDescription("The rules have sent to this channel successfully");

        await interaction.reply({ embeds: [ successEmbed ], ephemeral: true });
    }

    private async SendAccessButton(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const buttonLabel = await SettingsHelper.GetSetting("rules.access.label", interaction.guildId);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new ButtonBuilder()
                    .setCustomId('verify')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(buttonLabel || "Verify")
            ]);

        await interaction.channel?.send({
            components: [ row ]
        });

        await interaction.reply({
            content: "Success",
            ephemeral: true,
        });
    }
}