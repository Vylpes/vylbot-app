import { Message } from "discord.js";
import SettingsHelper from "../../helpers/SettingsHelper";
import VerificationCheck from "./MessageCreate/VerificationCheck";
import CacheHelper from "../../helpers/CacheHelper";
import LinkOnlyMode from "./MessageCreate/LinkOnlyMode";

export default async function MessageCreate(message: Message) {
    if (!message.guild) return;
    if (message.author.bot) return;

    await CacheHelper.UpdateServerCache(message.guild);

    await LinkOnlyMode(message);

    const isVerificationEnabled = await SettingsHelper.GetSetting("verification.enabled", message.guild.id);

    if (isVerificationEnabled && isVerificationEnabled.toLocaleLowerCase() == "true") {
        await VerificationCheck(message);
    }
}