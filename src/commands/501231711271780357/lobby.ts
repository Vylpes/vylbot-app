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

        super.Category = "General";
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
        const helpText = readFileSync(`${process.cwd()}/data/usage/lobby.txt`).toString();

        const embed = new PublicEmbed(context, "Configure Lobby Command", helpText);
        embed.SendToCurrentChannel();
    }

    private async AddLobbyConfig(context: ICommandContext) {
        const channel = context.message.guild!.channels.cache.find(x => x.id == context.args[2]);
        const role = context.message.guild!.roles.cache.find(x => x.id == context.args[3]);
        const cooldown = Number(context.args[4]) || 30;
        const gameName = context.args.splice(5).join(" ");

        if (!channel) {
            const errorEmbed = new ErrorEmbed(context, "The channel id you provided is invalid or channel does not exist.");
            errorEmbed.SendToCurrentChannel();

            return;
        }

        if (!role) {
            const errorEmbed = new ErrorEmbed(context, "The role id you provided is invalid or role does not exist.");
            errorEmbed.SendToCurrentChannel();

            return;
        }

        const lobby = await eLobby.FetchOneByChannelId(channel.id);

        if (lobby) {
            const errorEmbed = new ErrorEmbed(context, "This channel has already been setup.");
            errorEmbed.SendToCurrentChannel();
            
            return;
        }

        const entity = new eLobby(channel.id, role.id, cooldown, gameName);
        await entity.Save(eLobby, entity);

        const embed = new PublicEmbed(context, "", `Added \`${channel.name}\` as a new lobby channel with a cooldown of \`${cooldown} minutes\` and will ping \`${role.name}\` on use`);
        embed.SendToCurrentChannel();
    }

    private async RemoveLobbyConfig(context: ICommandContext) {
        const entity = await eLobby.FetchOneByChannelId(context.args[2]);

        if (!entity) {
            const errorEmbed = new ErrorEmbed(context, "The channel id you provided has not been setup as a lobby, unable to remove.");
            errorEmbed.SendToCurrentChannel();

            return;
        }
        
        await BaseEntity.Remove<eLobby>(eLobby, entity);

        const embed = new PublicEmbed(context, "", `Removed <#${context.args[2]}> from the list of lobby channels`);
        embed.SendToCurrentChannel();
    }
}