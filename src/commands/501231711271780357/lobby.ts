import { TextChannel } from "discord.js";
import { ICommandContext } from "../../contracts/ICommandContext";
import { Command } from "../../type/command";
import { default as eLobby } from "../../entity/501231711271780357/Lobby";

export default class Lobby extends Command {
    constructor() {
        super();

        super._category = "General";
    }

    public override async execute(context: ICommandContext) {
        if (!context.message.guild) return;

        const channel = context.message.channel as TextChannel;
        const channelId = channel.id;

        const lobby = await eLobby.FetchOneByChannelId(channelId);

        if (!lobby) {
            this.SendDisabled(context);
            return;
        }

        const timeNow = Date.now();
        const timeLength = lobby.Cooldown * 60 * 1000; // x minutes in ms
        const timeAgo = timeNow - timeLength;

        // If it was less than x minutes ago
        if (lobby.LastUsed.getTime() > timeAgo) {
            this.SendOnCooldown(context, timeLength, new Date(timeNow), lobby.LastUsed);
            return;
        }

        await this.RequestLobby(context, lobby);
    }

    private async RequestLobby(context: ICommandContext, lobby: eLobby) {
        lobby.MarkAsUsed();
        await lobby.Save(eLobby, lobby);

        context.message.channel.send(`${context.message.author} would like to organise a lobby of **${lobby.Name}**! <@&${lobby.RoleId}>`);
    }

    private SendOnCooldown(context: ICommandContext, timeLength: number, timeNow: Date, timeUsed: Date) {
        const timeLeft = Math.ceil((timeLength - (timeNow.getTime() - timeUsed.getTime())) / 1000 / 60);

        context.message.reply(`Requesting a lobby for this game is on cooldown! Please try again in **${timeLeft} minutes**.`);
    }

    private SendDisabled(context: ICommandContext) {
        context.message.reply("This channel hasn't been setup for lobbies.");
    }
}