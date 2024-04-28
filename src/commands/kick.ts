import { Command } from "../type/command";
import Audit from "../database/entities/Audit";
import { AuditType } from "../constants/AuditType";
import { CommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import EmbedColours from "../constants/EmbedColours";
import SettingsHelper from "../helpers/SettingsHelper";

export default class Kick extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("kick")
            .setDescription("Kick a member from the server with an optional reason")
            .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
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
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.guildId) return;
        if (!interaction.guild) return;

        const targetUser = interaction.options.get('target');
        const reasonInput = interaction.options.get('reason');

        if (!targetUser || !targetUser.user || !targetUser.member) {
            await interaction.reply("User not found.");
            return;
        }

        const member = targetUser.member as GuildMember;
        const reason = reasonInput && reasonInput.value ? reasonInput.value.toString() : "*none*";

        const logEmbed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Member Kicked")
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

        if (!member.kickable) {
            await interaction.reply('Insufficient permissions. Please contact a moderator.');
            return;
        }

        await member.kick();
        await interaction.reply(`\`${targetUser.user.tag}\` has been kicked.`);

        const channelName = await SettingsHelper.GetSetting('channels.logs.mod', interaction.guildId);

        if (!channelName) return;

        const channel = interaction.guild.channels.cache.find(x => x.name == channelName) as TextChannel;

        if (channel) {
            await channel.send({ embeds: [ logEmbed ]});
        }

        const audit = new Audit(targetUser.user.id, AuditType.Kick, reason, interaction.user.id, interaction.guildId);
        await audit.Save(Audit, audit);
    }
}