import { CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Command } from "../../../type/command";
import { default as eLobby } from "../../../entity/501231711271780357/Lobby";
import BaseEntity from "../../../contracts/BaseEntity";

export default class RemoveLobby extends Command {
    constructor() {
        super();

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('removelobby')
            .setDescription('Remove a lobby channel')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('The channel'));
    }

    public override async execute(interaction: CommandInteraction) {
        const channel = interaction.options.get('channel');

        if (!channel || !channel.channel) {
            await interaction.reply('Channel is required.');
            return;
        }

        const entity = await eLobby.FetchOneByChannelId(channel.channel.id);

        if (!entity) {
            await interaction.reply('Channel not found.');
            return;
        }
        
        await BaseEntity.Remove<eLobby>(eLobby, entity);

        await interaction.reply(`Removed <#${channel.channel.name}> from the list of lobby channels`);
    }
}