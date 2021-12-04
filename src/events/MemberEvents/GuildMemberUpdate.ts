import { GuildMember } from "discord.js";
import EventEmbed from "../../helpers/EventEmbed";

export default class GuildMemberUpdate {
    private _oldMember: GuildMember;
    private _newMember: GuildMember;

    constructor(oldMember: GuildMember, newMember: GuildMember) {
        this._oldMember = oldMember;
        this._newMember = newMember;
    }

    public NicknameChanged() {
        const oldNickname = this._oldMember.nickname || "*none*";
        const newNickname = this._newMember.nickname || "*none*";

        const embed = new EventEmbed(this._newMember.guild, "Nickname Changed");
        embed.AddUser("User", this._newMember.user, true);
        embed.addField("Before", oldNickname, true);
        embed.addField("After", newNickname, true);
        embed.setFooter(`Id: ${this._newMember.user.id}`);

        embed.SendToMemberLogsChannel();
    }
}