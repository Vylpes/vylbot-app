import { Event } from "../type/event";
import { GuildMember } from "discord.js";
import EventEmbed from "../helpers/embeds/EventEmbed";
import GuildMemberUpdate from "./MemberEvents/GuildMemberUpdate";
import IEventReturnContext from "../contracts/IEventReturnContext";

export default class MemberEvents extends Event {
    constructor() {
        super();
    }

    public override async guildMemberAdd(member: GuildMember): Promise<IEventReturnContext> {
        const embed = new EventEmbed(member.guild, "Member Joined");
        embed.AddUser("User", member.user, true);
        embed.addField("Created", member.user.createdAt);
        embed.setFooter(`Id: ${member.user.id}`);

        await embed.SendToMemberLogsChannel();

        return {
            embeds: [embed]
        };
    }

    public override async guildMemberRemove(member: GuildMember): Promise<IEventReturnContext> {
        const embed = new EventEmbed(member.guild, "Member Left");
        embed.AddUser("User", member.user, true);
        embed.addField("Joined", member.joinedAt);
        embed.setFooter(`Id: ${member.user.id}`);

        await embed.SendToMemberLogsChannel();

        return {
            embeds: [embed]
        };
    }

    public override async guildMemberUpdate(oldMember: GuildMember, newMember: GuildMember): Promise<IEventReturnContext> {
        const handler = new GuildMemberUpdate(oldMember, newMember);

        if (oldMember.nickname != newMember.nickname) { // Nickname change
            await handler.NicknameChanged();
        }

        return {
            embeds: []
        };
    }
}