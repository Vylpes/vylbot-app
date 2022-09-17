import { Event } from "../type/event";
import { EmbedBuilder, GuildChannel, GuildMember, TextChannel } from "discord.js";
import GuildMemberUpdate from "./MemberEvents/GuildMemberUpdate";
import SettingsHelper from "../helpers/SettingsHelper";
import EmbedColours from "../constants/EmbedColours";

export default class MemberEvents extends Event {
    constructor() {
        super();
    }

    public override async guildMemberAdd(member: GuildMember) {
        if (!member.guild) return;

        const enabled = await SettingsHelper.GetSetting("event.member.add.enabled", member.guild.id);
        if (!enabled || enabled.toLowerCase() != "true") return;

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle('Member Joined')
            .setDescription(`${member.user} \`${member.user.tag}\``)
            .setFooter({ text: `Id: ${member.user.id}` })
            .addFields([
                {
                    name: 'Created',
                    value: member.user.createdAt.toISOString(),
                }
            ]);

        const channelSetting = await SettingsHelper.GetSetting("event.member.add.channel", member.guild.id);

        if (!channelSetting) return;

        const channel = member.guild.channels.cache.find(x => x.name == channelSetting);

        if (!channel) return;

        const guildChannel = channel as TextChannel;

        await guildChannel.send({ embeds: [embed ]});
    }

    public override async guildMemberRemove(member: GuildMember) {
        if (!member.guild) return;

        const enabled = await SettingsHelper.GetSetting("event.member.remove.enabled", member.guild.id);
        if (!enabled || enabled.toLowerCase() != "true") return;

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle('Member Left')
            .setDescription(`${member.user} \`${member.user.tag}\``)
            .setFooter({ text: `Id: ${member.user.id}` })
            .addFields([
                {
                    name: 'Joined',
                    value: member.joinedAt ? member.joinedAt.toISOString() : "*none*",
                }
            ]);

        const channelSetting = await SettingsHelper.GetSetting("event.member.remove.channel", member.guild.id);

        if (!channelSetting) return;

        const channel = member.guild.channels.cache.find(x => x.name == channelSetting);

        if (!channel) return;

        const guildChannel = channel as TextChannel;

        await guildChannel.send({ embeds: [embed ]});
    }

    public override async guildMemberUpdate(oldMember: GuildMember, newMember: GuildMember) {
        const handler = new GuildMemberUpdate(oldMember, newMember);

        if (oldMember.nickname != newMember.nickname) { // Nickname change
            await handler.NicknameChanged();
        }
    }
}