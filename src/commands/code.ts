import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { CommandResponse } from "../constants/CommandResponse";
import { ICommandContext } from "../contracts/ICommandContext";
import SettingsHelper from "../helpers/SettingsHelper";
import StringTools from "../helpers/StringTools";
import { Command } from "../type/command";

export default class Code extends Command {
    constructor() {
        super();

        super.Category = "Moderation";
        super.Roles = [
            "moderator"
        ];

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('code')
            .setDescription('Manage the verification code of the server')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('randomise')
                    .setDescription('Regenerates the verification code for this server'))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('embed')
                    .setDescription('Sends the embed with the current code to the current channel'));
    }

    public override async precheckAsync(interaction: CommandInteraction): Promise<CommandResponse> {
        if (!interaction.isChatInputCommand()) return CommandResponse.NotInServer;
        if (!interaction.guild || !interaction.guildId) return CommandResponse.NotInServer;

        const isEnabled = await SettingsHelper.GetSetting("verification.enabled", interaction.guildId);

        if (!isEnabled) {
            return CommandResponse.FeatureDisabled;
        }

        if (isEnabled.toLocaleLowerCase() != 'true') {
            return CommandResponse.FeatureDisabled;
        }

        return CommandResponse.Ok;
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

        await interaction.channel.send({ embeds: [ embed ]});
    }
}