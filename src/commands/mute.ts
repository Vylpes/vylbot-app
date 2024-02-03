import { CommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { AuditType } from "../constants/AuditType";
import EmbedColours from "../constants/EmbedColours";
import Audit from "../database/entities/Audit";
import SettingsHelper from "../helpers/SettingsHelper";
import { Command } from "../type/command";

export default class Mute extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("mute")
            .setDescription("(DEPRECATED) Mute a member in the server with an optional reason")
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
            .addUserOption(option =>
                option
                    .setName('target')
                    .setDescription('The user')
                    .setRequired(true))
            .addStringOption(option =>
                option
                    .setName('reason')
                    .setDescription('The reason'));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.guild || !interaction.guildId) return;

        const targetUser = interaction.options.get('target');
        const reasonInput = interaction.options.get('reason');

        if (!targetUser || !targetUser.user || !targetUser.member) {
            await interaction.reply('Fields are required.');
            return;
        }

        const targetMember = targetUser.member as GuildMember;
        const reason = reasonInput && reasonInput.value ? reasonInput.value.toString() : "*none*";

        const logEmbed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Member Muted")
            .setDescription(`<@${targetUser.user.id}> \`${targetUser.user.tag}\``)
            .setThumbnail(targetUser.user.avatarURL())
            .addFields([
                {
                    name: "Moderator",
                    value: `<@${interaction.user.id}>`,
                },
                {
                    name: "Reason",
                    value: reason,
                },
            ]);

        const mutedRoleName = await SettingsHelper.GetSetting('role.muted', interaction.guildId);

        if (!mutedRoleName) {
            await interaction.reply('Unable to find configuration. Please contact the bot author.');
            return;
        }

        const mutedRole = interaction.guild.roles.cache.find(role => role.name == mutedRoleName);

        if (!mutedRole) {
            await interaction.reply('Muted role not found.');
            return;
        }

        if (!targetMember.manageable) {
            await interaction.reply('Insufficient permissions. Please contact a moderator.');
            return;
        }

        await targetMember.roles.add(mutedRole);

        const channelName = await SettingsHelper.GetSetting('channels.logs.mod', interaction.guildId);

        if (!channelName) return;

        const channel = interaction.guild.channels.cache.find(x => x.name == channelName) as TextChannel;

        if (channel) {
            await channel.send({ embeds: [ logEmbed ]});
        }

        const audit = new Audit(targetUser.user.id, AuditType.Mute, reason, interaction.user.id, interaction.guildId);
        await audit.Save(Audit, audit);

        await interaction.reply("Please note the mute and unmute commands have been deprecated and will be removed in a future update. Please use timeout instead");
    }
}