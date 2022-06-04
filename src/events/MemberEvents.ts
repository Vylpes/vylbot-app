import { Event } from "../type/event";
import { GuildMember } from "discord.js";
import EventEmbed from "../helpers/embeds/EventEmbed";
import GuildMemberUpdate from "./MemberEvents/GuildMemberUpdate";
import SettingsHelper from "../helpers/SettingsHelper";

export default class MemberEvents extends Event {
    constructor() {
        super();
    }

    public override async guildMemberAdd(member: GuildMember) {
        if (!member.guild) return;

        const enabled = await SettingsHelper.GetSetting("event.member.add.enabled", member.guild.id);
        if (!enabled || enabled.toLowerCase() != "true") return;

        const embed = new EventEmbed(member.client, member.guild, "Member Joined");
        embed.AddUser("User", member.user, true);
        embed.addField("Created", member.user.createdAt.toISOString());
        embed.setFooter({ text: `Id: ${member.user.id}` });

        const channel = await SettingsHelper.GetSetting("event.member.add.channel", member.guild.id);
        if (!channel || !member.guild.channels.cache.find(x => x.name == channel)) return;

        await embed.SendToChannel(channel);
    }

    public override async guildMemberRemove(member: GuildMember) {
        if (!member.guild) return;

        const enabled = await SettingsHelper.GetSetting("event.member.remove.enabled", member.guild.id);
        if (!enabled || enabled.toLowerCase() != "true") return;

        const embed = new EventEmbed(member.client, member.guild, "Member Left");
        embed.AddUser("User", member.user, true);
        embed.addField("Joined", member.joinedAt?.toISOString() || "n/a");
        embed.setFooter({ text: `Id: ${member.user.id}` });

        const channel = await SettingsHelper.GetSetting("event.member.remove.channel", member.guild.id);
        if (!channel || !member.guild.channels.cache.find(x => x.name == channel)) return;
        
        await embed.SendToChannel(channel);
    }

    public override async guildMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {
        const handler = new GuildMemberUpdate(oldMember, newMember);

        if (oldMember.nickname != newMember.nickname) { // Nickname change
            await handler.NicknameChanged();
        }
    }
}