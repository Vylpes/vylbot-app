import { GuildMember } from "discord.js";
import NicknameChanged from "./GuildMemberUpdate/NicknameChanged";
import CacheHelper from "../../helpers/CacheHelper";

export default async function GuildMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {
    await CacheHelper.UpdateServerCache(newMember.guild);

    if (oldMember.nickname !== newMember.nickname) { // Nickname change
        await NicknameChanged(oldMember, newMember);
    }
}