import { Command } from "../type/command";
import Audit from "../database/entities/Audit";
import { AuditType } from "../constants/AuditType";
import { CommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import EmbedColours from "../constants/EmbedColours";
import SettingsHelper from "../helpers/SettingsHelper";

export default class Ban extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("ban")
            .setDescription("Ban a member from the server with an optional reason")
            .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
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
            .setTitle("Member Banned")
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

        if (!member.bannable) {
            await interaction.reply('Insufficient permissions. Please contact a moderator.');
            return;
        }

        await member.ban();

        const channelName = await SettingsHelper.GetSetting('channels.logs.mod', interaction.guildId);

        if (!channelName) return;

        const channel = interaction.guild.channels.cache.find(x => x.name == channelName) as TextChannel;

        if (channel) {
            await channel.send({ embeds: [ logEmbed ]});
        }

        const dmEmbed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle(interaction.guild.name)
            .setDescription("You have been banned by a moderator.")
            .addFields([
                {
                    name: "Reason",
                    value: reason,
                },
            ]);

        let replyText = "Successfully banned user.";

        try {
            const dmChannel = await targetUser.user!.createDM();
            await dmChannel.send({ embeds: [ dmEmbed ] });
        } catch {
            replyText += " *Note: I was unable to DM the user the reason.*";
        }

        const audit = new Audit(targetUser.user.id, AuditType.Ban, reason, interaction.user.id, interaction.guildId);
        await audit.Save(Audit, audit);

        await interaction.reply(replyText);
    }
}