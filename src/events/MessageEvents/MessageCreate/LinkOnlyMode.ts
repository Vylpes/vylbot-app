import { Message } from "discord.js";
import SettingsHelper from "../../../helpers/SettingsHelper";

export default async function LinkOnlyMode(message: Message) {
    if (!message.guild) return;

    const gifOnlyMode = await SettingsHelper.GetSetting("channel.linkonly", message.guild.id);

    if (gifOnlyMode != message.channel.id) return;

    if (message.content.startsWith("https://") || message.content.startsWith("http://")) return;

    if (!message.deletable) return;

    await message.delete();
}