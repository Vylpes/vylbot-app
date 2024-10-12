import { CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import SettingsHelper from "../helpers/SettingsHelper";
import StringTools from "../helpers/StringTools";
import { Command } from "../type/command";

export default class Code extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName('code')
            .setDescription('Manage the verification code of the server')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
            .addSubcommand(subcommand =>
                subcommand
                    .setName('randomise')
                    .setDescription('Regenerates the verification code for this server'))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('embed')
                    .setDescription('Sends the embed with the current code to the current channel'));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.options.getSubcommand()) {
            case "randomise":
                await this.Randomise(interaction);
                break;
            case "embed":
                await this.SendEmbed(interaction);
                break;
        }
    }

    private async Randomise(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const randomCode = StringTools.RandomString(5);

        await SettingsHelper.SetSetting("verification.code", interaction.guildId, randomCode);

        await interaction.reply(`Entry code has been set to \`${randomCode}\``);
    }

    private async SendEmbed(interaction: CommandInteraction) {
        if (!interaction.guildId) return;
        if (!interaction.channel) return;

        const code = await SettingsHelper.GetSetting("verification.code", interaction.guildId);

        if (!code || code == "") {
            await interaction.reply("There is no code for this server setup.");
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("Entry Code")
            .setDescription(code);

        const channel = interaction.channel as TextChannel;

        await channel.send({ embeds: [ embed ]});
    }
}