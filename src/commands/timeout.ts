import { CacheType, CommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { AuditType } from "../constants/AuditType";
import EmbedColours from "../constants/EmbedColours";
import Audit from "../database/entities/Audit";
import SettingsHelper from "../helpers/SettingsHelper";
import TimeLengthInput from "../helpers/TimeLengthInput";
import { Command } from "../type/command";

export default class Timeout extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("timeout")
            .setDescription("Timeouts a user out, sending them a DM with the reason if possible")
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
            .addUserOption(option =>
                option
                    .setName('target')
                    .setDescription('The user')
                    .setRequired(true))
            .addStringOption(option =>
                option
                    .setName("length")
                    .setDescription("How long to timeout for? (Example: 24h, 60m)")
                    .setRequired(true))
            .addStringOption(option =>
                option
                    .setName('reason')
                    .setDescription('The reason'));
    }

    public override async execute(interaction: CommandInteraction<CacheType>) {
        if (!interaction.guild || !interaction.guildId) return;

        // Interaction Inputs
        const targetUser = interaction.options.get('target');
        const lengthInput = interaction.options.get('length');
        const reasonInput = interaction.options.get('reason');

        // Validation
        if (!targetUser || !targetUser.user || !targetUser.member) {
            await interaction.reply('Fields are required.');
            return;
        }

        if (!lengthInput || !lengthInput.value) {
            await interaction.reply('Fields are required.');
            return;
        }

        if (targetUser.user.bot) {
            await interaction.reply('Cannot timeout bots.');
            return;
        }

        // General Variables
        const targetMember = targetUser.member as GuildMember;
        const reason = reasonInput && reasonInput.value ? reasonInput.value.toString() : null;

        const timeLength = new TimeLengthInput(lengthInput.value.toString());

        const logEmbed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Member Timed Out")
            .setDescription(`<@${targetUser.user.id}> \`${targetUser.user.tag}\``)
            .setThumbnail(targetUser.user.avatarURL())
            .addFields([
                {
                    name: "Moderator",
                    value: `<@${interaction.user.id}>`,
                },
                {
                    name: "Reason",
                    value: reason || "*none*",
                },
                {
                    name: "Length",
                    value: timeLength.GetLengthShort(),
                },
                {
                    name: "Until",
                    value: timeLength.GetDateFromNow().toString(),
                },
            ]);

        // Bot Permissions Check
        if (!targetMember.manageable) {
            await interaction.reply('Insufficient bot permissions. Please contact a moderator.');
            return;
        }

        // Execute Timeout
        await targetMember.timeout(timeLength.GetMilliseconds(), reason || "");

        // Log Embed To Channel
        const channelName = await SettingsHelper.GetSetting('channels.logs.mod', interaction.guildId);

        if (!channelName) return;

        const channel = interaction.guild.channels.cache.find(x => x.name == channelName) as TextChannel;

        if (channel) {
            await channel.send({ embeds: [ logEmbed ]});
        }

        const dmEmbed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle(interaction.guild.name)
            .setDescription("You have been given a warning by a moderator.")
            .addFields([
                {
                    name: "Reason",
                    value: reason || "*none*",
                },
            ]);

        let replyText = "Successfully warned user.";

        try {
            const dmChannel = await targetUser.user!.createDM();
            await dmChannel.send({ embeds: [ dmEmbed ] });
        } catch {
            replyText += " *Note: I was unable to DM the user the reason.*";
        }

        // Create Audit
        const audit = new Audit(targetUser.user.id, AuditType.Timeout, reason || "*none*", interaction.user.id, interaction.guildId);
        await audit.Save(Audit, audit);

        await interaction.reply(replyText);
    }
}