import { Message } from "discord.js";
import SettingsHelper from "../../helpers/SettingsHelper";
import VerificationCheck from "./MessageCreate/VerificationCheck";

export default async function MessageCreate(message: Message) {
    if (!message.guild) return;
    if (message.author.bot) return;

    const isVerificationEnabled = await SettingsHelper.GetSetting("verification.enabled", message.guild.id);

    if (isVerificationEnabled && isVerificationEnabled.toLocaleLowerCase() == "true") {
        await VerificationCheck(message);
    }
}