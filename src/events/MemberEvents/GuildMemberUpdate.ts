import { GuildMember } from "discord.js";
import NicknameChanged from "./GuildMemberUpdate/NicknameChanged";

export default async function GuildMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {
    if (oldMember.nickname != newMember.nickname) { // Nickname change
        await NicknameChanged(oldMember, newMember);
    }
}