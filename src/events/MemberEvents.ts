import { Event } from "vylbot-core";
import { GuildMember } from "discord.js";
import EventEmbed from "../helpers/EventEmbed";
import GuildMemberUpdate from "./MemberEvents/GuildMemberUpdate";

export default class MemberEvents extends Event {
    constructor() {
        super();
    }

    public override guildMemberAdd(member: GuildMember) {
        const embed = new EventEmbed(member.guild, "Member Joined");
        embed.AddUser("User", member.user, true);
        embed.addField("Created", member.user.createdAt);
        embed.setFooter(`Id: ${member.user.id}`);

        embed.SendToMemberLogsChannel();
    }

    public override guildMemberRemove(member: GuildMember) {
        const embed = new EventEmbed(member.guild, "Member Left");
        embed.AddUser("User", member.user, true);
        embed.addField("Joined", member.joinedAt);
        embed.setFooter(`Id: ${member.user.id}`);

        embed.SendToMemberLogsChannel();
    }

    public override guildMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {
        const handler = new GuildMemberUpdate(oldMember, newMember);

        if (oldMember.nickname != newMember.nickname) { // Nickname change
            handler.NicknameChanged();
        }
    }
}