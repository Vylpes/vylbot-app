import { CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Command } from "../../../type/command";
import { default as eLobby } from "../../../database/entities/501231711271780357/Lobby";

export default class AddRole extends Command {
    constructor() {
        super();

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('addlobby')
            .setDescription('Add lobby channel')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('The channel')
                    .setRequired(true))
            .addRoleOption(option =>
                option
                    .setName('role')
                    .setDescription('The role to ping on request')
                    .setRequired(true))
            .addNumberOption(option =>
                option
                    .setName('cooldown')
                    .setDescription('The cooldown in minutes')
                    .setRequired(true))
            .addStringOption(option =>
                option
                    .setName('name')
                    .setDescription('The game name')
                    .setRequired(true));
    }

    public override async execute(interaction: CommandInteraction) {
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

        await interaction.reply(`Added \`${channel.name}\` as a new lobby channel with a cooldown of \`${cooldown.value} minutes \` and will ping \`${role.name}\` on use`);
    }
}