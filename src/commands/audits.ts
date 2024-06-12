import Audit from "../database/entities/Audit";
import AuditTools from "../helpers/AuditTools";
import { Command } from "../type/command";
import { CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { AuditType } from "../constants/AuditType";
import EmbedColours from "../constants/EmbedColours";

export default class Audits extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("audits")
            .setDescription("View audits of a particular user in the server")
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
            .addSubcommand(subcommand =>
                subcommand
                    .setName('user')
                    .setDescription('View all audits done against a user')
                    .addUserOption(option =>
                        option
                            .setName('target')
                            .setDescription('The user')
                            .setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('view')
                    .setDescription('View a particular audit')
                    .addStringOption(option =>
                        option
                            .setName('auditid')
                            .setDescription('The audit id in caps')
                            .setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('clear')
                    .setDescription('Clears an audit from a user')
                    .addStringOption(option =>
                        option
                            .setName('auditid')
                            .setDescription('The audit id in caps')
                            .setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('add')
                    .setDescription('Manually add an audit')
                    .addUserOption(option =>
                        option
                            .setName('target')
                            .setDescription('The user')
                            .setRequired(true))
                    .addStringOption(option =>
                        option
                            .setName('type')
                            .setDescription('The type of audit')
                            .setRequired(true)
                            .addChoices(
                                { name: 'General', value: AuditType.General.toString() },
                                { name: 'Warn', value: AuditType.Warn.toString() },
                                { name: 'Mute', value: AuditType.Mute.toString() },
                                { name: 'Kick', value: AuditType.Kick.toString() },
                                { name: 'Ban', value: AuditType.Ban.toString() },
                            )
                            .setRequired(true))
                    .addStringOption(option =>
                        option
                            .setName('reason')
                            .setDescription('The reason')));

    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.options.getSubcommand()) {
            case "user":
                await this.SendAuditForUser(interaction);
                break;
            case "view":
                await this.SendAudit(interaction);
                break;
            case "clear":
                await this.ClearAudit(interaction);
                break;
            case "add":
                await this.AddAudit(interaction);
                break;
            default:
                await interaction.reply("Subcommand doesn't exist.");
        }
    }

    private async SendAuditForUser(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const user = interaction.options.get('target', true).user!;

        if (!user) {
            await interaction.reply("User not found.");
            return;
        }

        const audits = await Audit.FetchAuditsByUserId(user.id, interaction.guildId);

        if (!audits || audits.length == 0) {
            await interaction.reply("There are no audits for this user.");
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Audits")
            .setDescription(`Audits: ${audits.length}`);

        for (let audit of audits) {
            embed.addFields([
                {
                    name: `${audit.AuditId} // ${AuditTools.TypeToFriendlyText(audit.AuditType)}`,
                    value: audit.WhenCreated.toString(),
                }
            ]);
        }

        await interaction.reply({ embeds: [ embed ]});
    }

    private async SendAudit(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const auditId = interaction.options.get('auditid');

        if (!auditId || !auditId.value) {
            await interaction.reply("AuditId not found.");
            return;
        }

        const audit = await Audit.FetchAuditByAuditId(auditId.value.toString().toUpperCase(), interaction.guildId);

        if (!audit) {
            await interaction.reply("Audit not found.");
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Audit")
            .setDescription(audit.AuditId.toUpperCase())
            .addFields([
                {
                    name: "Reason",
                    value: audit.Reason || "*none*",
                    inline: true,
                },
                {
                    name: "Type",
                    value: AuditTools.TypeToFriendlyText(audit.AuditType),
                    inline: true,
                },
                {
                    name: "Moderator",
                    value: `<@${audit.ModeratorId}>`,
                    inline: true,
                },
            ]);

            await interaction.reply({ embeds: [ embed ]});
    }

    private async ClearAudit(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const auditId = interaction.options.get('auditid');

        if (!auditId || !auditId.value) {
            await interaction.reply("AuditId not found.");
            return;
        }

        const audit = await Audit.FetchAuditByAuditId(auditId.value.toString().toUpperCase(), interaction.guildId);

        if (!audit) {
            await interaction.reply("Audit not found.");
            return;
        }

        await Audit.Remove(Audit, audit);

        await interaction.reply("Audit cleared.");
    }

    private async AddAudit(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const user = interaction.options.get('target', true).user!;
        const auditType = interaction.options.get('type');
        const reasonInput = interaction.options.get('reason');

        if (!user || !auditType || !auditType.value) {
            await interaction.reply("Invalid input.");
            return;
        }

        const type = auditType.value as AuditType;
        const reason = reasonInput && reasonInput.value ? reasonInput.value.toString() : "";

        const audit = new Audit(user.id, type, reason, interaction.user.id, interaction.guildId);

        await audit.Save(Audit, audit);

        await interaction.reply(`Created new audit with ID \`${audit.AuditId}\``);
    }
}