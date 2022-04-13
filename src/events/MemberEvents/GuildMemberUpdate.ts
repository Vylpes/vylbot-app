import { GuildMember } from "discord.js";
import IEventReturnContext from "../../contracts/IEventReturnContext";
import EventEmbed from "../../helpers/embeds/EventEmbed";

export default class GuildMemberUpdate {
    public oldMember: GuildMember;
    public newMember: GuildMember;

    constructor(oldMember: GuildMember, newMember: GuildMember) {
        this.oldMember = oldMember;
        this.newMember = newMember;
    }

    public async NicknameChanged(): Promise<IEventReturnContext> {
        const oldNickname = this.oldMember.nickname || "*none*";
        const newNickname = this.newMember.nickname || "*none*";

        const embed = new EventEmbed(this.newMember.guild, "Nickname Changed");
        embed.AddUser("User", this.newMember.user, true);
        embed.addField("Before", oldNickname, true);
        embed.addField("After", newNickname, true);
        embed.setFooter({ text: `Id: ${this.newMember.user.id}` });

        await embed.SendToMemberLogsChannel();

        return {
            embeds: [embed]
        };
    }
}