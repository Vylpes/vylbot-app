import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { readFileSync } from "fs";
import { CommandResponse } from "../constants/CommandResponse";
import DefaultValues from "../constants/DefaultValues";
import EmbedColours from "../constants/EmbedColours";
import { ICommandContext } from "../contracts/ICommandContext";
import Server from "../entity/Server";
import Setting from "../entity/Setting";
import { Command } from "../type/command";

export default class Config extends Command {
    constructor() {
        super();
        super.Category = "Administration";
        super.Roles = [
            "administrator"
        ]

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('config')
            .setDescription('Configure the current server')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('reset')
                    .setDescription('Reset a setting to the default')
                    .addStringOption(option =>
                        option
                            .setName('key')
                            .setDescription('The key')))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('get')
                    .setDescription('Gets a setting for the server')
                    .addStringOption(option =>
                        option
                            .setName('key')
                            .setDescription('The key')))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('set')
                    .setDescription('Sets a setting to a specified value')
                    .addStringOption(option =>
                        option
                            .setName('key')
                            .setDescription('The key'))
                    .addStringOption(option =>
                        option
                            .setName('value')
                            .setDescription('The value')))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('list')
                    .setDescription('Lists all settings'))
    }

    public override async precheckAsync(interaction: CommandInteraction): Promise<CommandResponse> {
        if (!interaction.guildId) return CommandResponse.ServerNotSetup;

        const server = await Server.FetchOneById<Server>(Server, interaction.guildId, [
            "Settings",
        ]);

        if (!server) {
            return CommandResponse.ServerNotSetup;
        }

        return CommandResponse.Ok;
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.options.getSubcommand()) {
            case 'list':
                await this.SendHelpText(interaction);
                break;
            case 'reset':
                await this.ResetValue(interaction);
                break;
            case 'get':
                await this.GetValue(interaction);
                break;
            case 'set':
                await this.SetValue(interaction);
                break;
            default:
                await interaction.reply('Subcommand not found.');
        }
    }

    private async SendHelpText(interaction: CommandInteraction) {
        const description = readFileSync(`${process.cwd()}/data/usage/config.txt`).toString();

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Config")
            .setDescription(description);

        await interaction.reply({ embeds: [ embed ]});
    }

    private async GetValue(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const key = interaction.options.get('key');

        if (!key || !key.value) {
            await interaction.reply('Fields are required.');
            return;
        }

        const server = await Server.FetchOneById<Server>(Server, interaction.guildId, [
            "Settings",
        ]);

        if (!server) {
            await interaction.reply('Server not found.');
            return;
        }

        const setting = server.Settings.filter(x => x.Key == key.value)[0];

        if (setting) {
            await interaction.reply(`\`${key}\`: \`${setting.Value}\``);
        } else {
            await interaction.reply(`\`${key}\`: \`${DefaultValues.GetValue(key.value.toString())}\` <DEFAULT>`);
        }
    }

    private async ResetValue(interaction: CommandInteraction) {
        if (!interaction.guildId) return;
        
        const key = interaction.options.get('key');

        if (!key || !key.value) {
            await interaction.reply('Fields are required.');
            return;
        }

        const server = await Server.FetchOneById<Server>(Server, interaction.guildId, [
            "Settings",
        ]);

        if (!server) {
            await interaction.reply('Server not found.');
            return;
        }

        const setting = server.Settings.filter(x => x.Key == key.value)[0];

        if (!setting) {
            await interaction.reply('Setting not found.');
            return;
        }

        await Setting.Remove(Setting, setting);

        await interaction.reply('The setting has been reset to the default.');
    }

    private async SetValue(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const key = interaction.options.get('key');
        const value = interaction.options.get('value');

        if (!key || !key.value || !value || !value.value) {
            await interaction.reply('Fields are required.');
            return;
        }

        const server = await Server.FetchOneById<Server>(Server, interaction.guildId, [
            "Settings",
        ]);

        if (!server) {
            await interaction.reply('Server not found.');
            return;
        }

        const setting = server.Settings.filter(x => x.Key == key.value)[0];

        if (setting) {
            setting.UpdateBasicDetails(key.value.toString(), value.value.toString());

            await setting.Save(Setting, setting);
        } else {
            const newSetting = new Setting(key.value.toString(), value.value.toString());

            await newSetting.Save(Setting, newSetting);

            server.AddSettingToServer(newSetting);

            await server.Save(Server, server);
        }

        await interaction.reply('Setting has been set.');
    }
}