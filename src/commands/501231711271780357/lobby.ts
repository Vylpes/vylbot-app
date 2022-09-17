import { CommandInteraction, GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import { Command } from "../../type/command";
import { default as eLobby } from "../../entity/501231711271780357/Lobby";
import SettingsHelper from "../../helpers/SettingsHelper";
import BaseEntity from "../../contracts/BaseEntity";

export default class Lobby extends Command {
    constructor() {
        super();

        super.Category = "General";

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('lobby')
            .setDescription('Attempt to organise a lobby')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('config')
                    .setDescription('Configure the lobby command (mods only)')
                    .addStringOption(option =>
                        option
                            .setName('action')
                            .setDescription('Add or remove a channel to the lobby list')
                            .addChoices(
                                { name: 'add', value: 'add' },
                                { name: 'remove', value: 'remove' },
                            ))
                    .addChannelOption(option =>
                        option
                            .setName('channel')
                            .setDescription('The channel'))
                    .addRoleOption(option =>
                        option
                            .setName('role')
                            .setDescription('The role to ping on request'))
                    .addNumberOption(option =>
                        option
                            .setName('cooldown')
                            .setDescription('The cooldown in minutes'))
                    .addStringOption(option =>
                        option
                            .setName('name')
                            .setDescription('The game name')));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.options.getSubcommand()) {
            case "config":
                await this.Configure(interaction);
                break;
            case "request":
                await this.Request(interaction);
                break;
        }
    }

    private async Request(interaction: CommandInteraction) {
        if (!interaction.channelId) return;
    
        const lobby = await eLobby.FetchOneByChannelId(interaction.channelId);

        if (!lobby) {
            await interaction.reply('This channel is disabled from using the lobby command.');
            return;
        }

        const timeNow = Date.now();
        const timeLength = lobby.Cooldown * 60 * 1000; // x minutes in ms
        const timeAgo = timeNow - timeLength;

        // If it was less than x minutes ago
        if (lobby.LastUsed.getTime() > timeAgo) {
            const timeLeft = Math.ceil((timeLength - (timeNow - lobby.LastUsed.getTime())) / 1000 / 60);

            await interaction.reply(`Requesting a lobby for this game is on cooldown! Please try again in **${timeLeft} minutes**.`);
            return;
        }

        lobby.MarkAsUsed();
        await lobby.Save(eLobby, lobby);

        await interaction.reply(`${interaction.user} would like to organise a lobby of **${lobby.Name}**! <@${lobby.RoleId}>`);
    }

    private async Configure(interaction: CommandInteraction) {
        if (!interaction.guildId) return;
        if (!interaction.member) return;

        const moderatorRole = await SettingsHelper.GetSetting("role.moderator", interaction.guildId);

        const roleManager = interaction.member.roles as GuildMemberRoleManager;

        if (!roleManager.cache.find(x => x.name == moderatorRole)) {
            await interaction.reply('Sorry, you must be a moderator to be able to configure this command.');
            return;
        }

        const action = interaction.options.get('action');

        if (!action || !action.value) {
            await interaction.reply('Action is required.');
            return;
        }

        switch (action.value) {
            case "add":
                await this.AddLobbyConfig(interaction);
                break;
            case "remove":
                await this.RemoveLobbyConfig(interaction);
                break;
            default:
                await interaction.reply('Action not found.');
        }
    }

    private async AddLobbyConfig(interaction: CommandInteraction) {
        const channel = interaction.options.get('channel');
        const role = interaction.options.get('role');
        const cooldown = interaction.options.get('cooldown');
        const gameName = interaction.options.get('name');

        if (!channel || !channel.channel || !role || !role.role || !cooldown || !cooldown.value || !gameName || !gameName.value) {
            await interaction.reply('Fields are required.');
            return;
        }

        const lobby = await eLobby.FetchOneByChannelId(channel.channel.id);

        if (lobby) {
            await interaction.reply('This channel has already been setup.');
            return;
        }

        const entity = new eLobby(channel.channel.id, role.role.id, cooldown.value as number, gameName.value as string);
        await entity.Save(eLobby, entity);

        await interaction.reply(`Added \`${channel.name}\` as a new lobby channel with a cooldown of \`${cooldown} minutes \` and will ping \`${role.name}\` on use`);
    }

    private async RemoveLobbyConfig(interaraction: CommandInteraction) {
        const channel = interaraction.options.get('channel');

        if (!channel || !channel.channel) {
            await interaraction.reply('Channel is required.');
            return;
        }

        const entity = await eLobby.FetchOneByChannelId(channel.channel.id);

        if (!entity) {
            await interaraction.reply('Channel not found.');
            return;
        }
        
        await BaseEntity.Remove<eLobby>(eLobby, entity);

        await interaraction.reply(`Removed <#${channel.channel.name}> from the list of lobby channels`);
    }
}