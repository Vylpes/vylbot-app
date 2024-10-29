import { Message } from "discord.js";
import SettingsHelper from "../../../helpers/SettingsHelper";

export default async function LinkOnlyMode(message: Message) {
    if (!message.guild) return;

    const gifOnlyMode = await SettingsHelper.GetSetting("channel.linkonly", message.guild.id);

    if (!gifOnlyMode) return;

    const channel = message.guild.channels.cache.find(x => x.id == gifOnlyMode) || message.guild.channels.fetch(gifOnlyMode);

    if (!channel) return;

    if (message.content.startsWith("https://") || message.content.startsWith("http://")) return;

    if (!message.deletable) return;

    await message.delete();
}