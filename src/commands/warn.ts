import { CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { AuditType } from "../constants/AuditType";
import EmbedColours from "../constants/EmbedColours";
import Audit from "../database/entities/Audit";
import SettingsHelper from "../helpers/SettingsHelper";
import { Command } from "../type/command";

export default class Warn extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("warn")
            .setDescription("Warns a member in the server with an optional reason")
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

        const reason = reasonInput && reasonInput.value ? reasonInput.value.toString() : "*none*";

        const logEmbed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Member Warned")
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
                    value: reason,
                },
            ]);

        let replyText = "Successfully warned user.";

        try {
            const dmChannel = await targetUser.user!.createDM();
            await dmChannel.send({ embeds: [ dmEmbed ] });
        } catch {
            replyText += " *Note: I was unable to DM the user the reason.*";
        }

        const audit = new Audit(targetUser.user.id, AuditType.Warn, reason, interaction.user.id, interaction.guildId);
        await audit.Save(Audit, audit);

        await interaction.reply(replyText);
    }
}