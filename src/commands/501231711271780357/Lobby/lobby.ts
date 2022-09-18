import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../../type/command";
import { default as eLobby } from "../../../entity/501231711271780357/Lobby";

export default class Lobby extends Command {
    constructor() {
        super();

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('lobby')
            .setDescription('Attempt to organise a lobby');
    }

    public override async execute(interaction: CommandInteraction) {
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

        await interaction.reply(`${interaction.user} would like to organise a lobby of **${lobby.Name}**! <@&${lobby.RoleId}>`);
    }
}