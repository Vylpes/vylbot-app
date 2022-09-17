import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import SettingsHelper from "../helpers/SettingsHelper";
import { Command } from "../type/command";

export default class Disable extends Command {
    constructor() {
        super();

        super.Category = "Moderation";
        super.Roles = [
            "moderator"
        ];

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('disable')
            .setDescription('Disables a command')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('add')
                    .setDescription('Disables a command for the server')
                    .addStringOption(option =>
                        option
                            .setName('name')
                            .setDescription('The name of the command')
                            .setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('remove')
                    .setDescription('Enables a command for the server')
                    .addStringOption(option =>
                        option
                            .setName('name')
                            .setDescription('The name of the command')
                            .setRequired(true)));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.options.getSubcommand()) {
            case "add":
                await this.Add(interaction);
                break;
            case "remove":
                await this.Remove(interaction);
                break;
            default:
                await interaction.reply('Subcommand not found.');
        }
    }

    private async Add(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const commandName = interaction.options.get('name');

        if (!commandName || !commandName.value) {
            await interaction.reply('Fields are required.');
            return;
        }

        const disabledCommandsString = await SettingsHelper.GetSetting("commands.disabled", interaction.guildId);
        const disabledCommands = disabledCommandsString != "" ? disabledCommandsString?.split(",") : [];

        disabledCommands?.push(commandName.value.toString());

        await SettingsHelper.SetSetting("commands.disabled", interaction.guildId, disabledCommands!.join(","));

        await interaction.reply(`Disabled command ${commandName.value}`);
    }

    private async Remove(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const commandName = interaction.options.get('name');

        if (!commandName || !commandName.value) {
            await interaction.reply('Fields are required.');
            return;
        }

        const disabledCommandsString = await SettingsHelper.GetSetting("commands.disabled", interaction.guildId);
        const disabledCommands = disabledCommandsString != "" ? disabledCommandsString?.split(",") : [];

        const disabledCommandsInstance = disabledCommands?.findIndex(x => x == commandName.value!.toString());

        if (disabledCommandsInstance! > -1) {
            disabledCommands?.splice(disabledCommandsInstance!, 1);
        }

        await SettingsHelper.SetSetting("commands.disabled", interaction.guildId, disabledCommands!.join(","));

        await interaction.reply(`Enabled command ${commandName.value}`);
    }
}