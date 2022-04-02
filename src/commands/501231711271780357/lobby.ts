import { TextChannel } from "discord.js";
import { SOURCE_MAPPING_PREFIX } from "ts-jest";
import { ICommandContext } from "../../contracts/ICommandContext";
import ErrorEmbed from "../../helpers/embeds/ErrorEmbed";
import SettingsHelper from "../../helpers/SettingsHelper";
import { Command } from "../../type/command";

export default class Lobby extends Command {
    constructor() {
        super();

        super._category = "General";
    }

    public override async execute(context: ICommandContext) {
        if (!context.message.guild) return;

        const channel = context.message.channel as TextChannel;
        const channelName = channel.name;
        const channelId = channel.id;

        // TODO: Check if channel is enabled for this

        const timeUsed = await SettingsHelper.GetSetting(`commands.lobby.channel.${channelId}.time`, context.message.guild.id);

        if (!timeUsed) {
            await this.RequestLobby(context, channelId, context.message.guild.id);
            return;
        }

        const timeNow = Date.now();
        const timeCooldown = await SettingsHelper.GetSetting('commands.lobby.cooldown', context.message.guild.id) || "30";
        const timeLength = parseInt(timeCooldown) * 60 * 1000; // x minutes in ms
        const timeAgo = timeNow - timeLength;

        // If it was less than x minutes ago
        if (parseInt(timeUsed) > timeAgo) {
            this.SendOnCooldown(context, timeLength, timeNow, parseInt(timeUsed));
            return;
        }

        await this.RequestLobby(context, channelId, context.message.guild.id);
    }

    private async RequestLobby(context: ICommandContext, channelId: string, serverId: string) {
        const roleId = await SettingsHelper.GetSetting(`commands.lobby.channel.${channelId}.role`, serverId);

        if (!roleId) {
            const errorEmbed = new ErrorEmbed(context, "Unable to find the channel's role");
            errorEmbed.setFooter(`commands.lobby.channel.${channelId}.role`);

            errorEmbed.SendToCurrentChannel();
            return;
        }

        const gameName = await SettingsHelper.GetSetting(`commands.lobby.channel.${channelId}.game`, serverId);

        if (!gameName) {
            const errorEmbed = new ErrorEmbed(context, "Unable to find the channel's game name");
            errorEmbed.setFooter(`commands.lobby.channel.${channelId}.game`);

            errorEmbed.SendToCurrentChannel();
            return;
        }

        await SettingsHelper.SetSetting(`commands.lobby.channel.${channelId}.time`, serverId, `${Date.now()}`);

        context.message.channel.send(`${context.message.author} would like to organise a lobby of **${gameName}**! <@&${roleId}>`);
    }

    private SendOnCooldown(context: ICommandContext, timeLength: number, timeNow: number, timeUsed: number) {
        const timeLeft = Math.ceil((timeLength - (timeNow - timeUsed)) / 1000 / 60);

        context.message.reply(`Requesting a lobby for this game is on cooldown! Please try again in **${timeLeft} minutes**.`);
    }
}