import { TextChannel } from "discord.js";
import { ICommandContext } from "../../contracts/ICommandContext";
import { Command } from "../../type/command";
import { default as eLobby } from "../../entity/501231711271780357/Lobby";
import SettingsHelper from "../../helpers/SettingsHelper";
import PublicEmbed from "../../helpers/embeds/PublicEmbed";
import { readFileSync } from "fs";
import ErrorEmbed from "../../helpers/embeds/ErrorEmbed";
import BaseEntity from "../../contracts/BaseEntity";

export default class Lobby extends Command {
    constructor() {
        super();

        super._category = "General";
    }

    public override async execute(context: ICommandContext) {
        if (!context.message.guild) return;

        switch (context.args[0]) {
            case "config":
                await this.UseConfig(context);
                break;
            default:
                await this.UseDefault(context);
        }
    }

    // =======
    // Default
    // =======

    private async UseDefault(context: ICommandContext) {
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

    // ======
    // Config
    // ======
    private async UseConfig(context: ICommandContext) {
        const moderatorRole = await SettingsHelper.GetSetting("role.moderator", context.message.guild!.id);

        if (!context.message.member?.roles.cache.find(x => x.name == moderatorRole)) {
            const errorEmbed = new ErrorEmbed(context, "Sorry, you must be a moderator to be able to configure this command");
            errorEmbed.SendToCurrentChannel();

            return;
        }

        switch (context.args[1]) {
            case "add":
                await this.AddLobbyConfig(context);
                break;
            case "remove":
                await this.RemoveLobbyConfig(context);
                break;
            case "help":
            default:
                this.SendConfigHelp(context);
        }
    }

    private SendConfigHelp(context: ICommandContext) {
        const helpText = readFileSync(`${process.cwd()}/data/lobbyConfig.txt`).toString();

        const embed = new PublicEmbed(context, "Configure Lobby Command", helpText);
        embed.SendToCurrentChannel();
    }

    private async AddLobbyConfig(context: ICommandContext) {
        const channel = context.message.guild!.channels.cache.find(x => x.name == context.args[2]);
        const role = context.message.guild!.roles.cache.find(x => x.name == context.args[3]);
        const cooldown = context.args[4] || "30";
        const gameName = context.args.splice(5).join(" ");

        if (!channel || !role) {
            this.SendConfigHelp(context);
            return;
        }

        const entity = new eLobby(channel.id, role.id, Number.parseInt(cooldown), gameName);
        await entity.Save(eLobby, entity);

        const embed = new PublicEmbed(context, "", "Added new lobby channel");
        embed.SendToCurrentChannel();
    }

    private async RemoveLobbyConfig(context: ICommandContext) {
        const channel = context.message.guild!.channels.cache.find(x => x.name == context.args[2]);

        if (!channel) {
            this.SendConfigHelp(context);
            return;
        }

        const entity = await eLobby.FetchOneByChannelId(channel.id);

        if (entity) {
            await BaseEntity.Remove<eLobby>(eLobby, entity);
        }

        const embed = new PublicEmbed(context, "", "Removed lobby channel");
        embed.SendToCurrentChannel();
    }
}