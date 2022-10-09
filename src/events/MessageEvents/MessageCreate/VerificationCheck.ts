import { Message } from "discord.js";
import SettingsHelper from "../../../helpers/SettingsHelper";

export default async function VerificationCheck(message: Message) {
    if (!message.guild) return;

    const verificationChannel = await SettingsHelper.GetSetting("verification.channel", message.guild.id);

    if (!verificationChannel) {
        return;
    }

    const channel = message.guild.channels.cache.find(x => x.name == verificationChannel);
    
    if (!channel) {
        return;
    }

    const currentChannel = message.guild.channels.cache.find(x => x == message.channel);

    if (!currentChannel || currentChannel.name != verificationChannel) {
        return;
    }

    const verificationCode = await SettingsHelper.GetSetting("verification.code", message.guild.id);

    if (!verificationCode || verificationCode == "") {
        await message.reply("`verification.code` is not set inside of the server's config. Please contact the server's mod team.");
        await message.delete();

        return;
    }

    const verificationRoleName = await SettingsHelper.GetSetting("verification.role", message.guild.id);

    if (!verificationRoleName) {
        await message.reply("`verification.role` is not set inside of the server's config. Please contact the server's mod team.");
        await message.delete();
        return;
    }

    const role = message.guild.roles.cache.find(x => x.name == verificationRoleName);

    if (!role) {
        await message.reply("The entry role configured for this server does not exist. Please contact the server's mod team.");
        await message.delete();
        return;
    }

    if (message.content.toLocaleLowerCase() != verificationCode.toLocaleLowerCase()) {
        await message.delete();
        return;
    }

    await message.member?.roles.add(role);
    await message.delete();
}