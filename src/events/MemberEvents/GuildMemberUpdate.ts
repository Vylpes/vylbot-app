import { GuildMember } from "discord.js";
import EventEmbed from "../../helpers/embeds/EventEmbed";
import SettingsHelper from "../../helpers/SettingsHelper";

export default class GuildMemberUpdate {
    public oldMember: GuildMember;
    public newMember: GuildMember;

    constructor(oldMember: GuildMember, newMember: GuildMember) {
        this.oldMember = oldMember;
        this.newMember = newMember;
    }

    public async NicknameChanged() {
        const enabled = await SettingsHelper.GetSetting("event.member.update.enabled", this.newMember.guild.id);
        if (!enabled || enabled.toLowerCase() != "true") return;

        const oldNickname = this.oldMember.nickname || "*none*";
        const newNickname = this.newMember.nickname || "*none*";

        const embed = new EventEmbed(this.oldMember.client, this.newMember.guild, "Nickname Changed");
        embed.AddUser("User", this.newMember.user, true);
        embed.addField("Before", oldNickname, true);
        embed.addField("After", newNickname, true);
        embed.setFooter({ text: `Id: ${this.newMember.user.id}` });
    
        const channel = await SettingsHelper.GetSetting("event.member.update.channel", this.newMember.guild.id);
        if (!channel || channel.toLowerCase() != "true") return;

        await embed.SendToChannel(channel);
    }
}