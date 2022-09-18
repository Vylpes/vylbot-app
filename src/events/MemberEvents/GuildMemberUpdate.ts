import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";
import EmbedColours from "../../constants/EmbedColours";
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

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle('Nickname Changed')
            .setDescription(`${this.newMember.user} \`${this.newMember.user.tag}\``)
            .setFooter({ text: `Id: ${this.newMember.user.id}` })
            .addFields([
                {
                    name: 'Before',
                    value: oldNickname,
                },
                {
                    name: 'After',
                    value: newNickname,
                },
            ]);
    
            const channelSetting = await SettingsHelper.GetSetting("event.member.update.channel", this.newMember.guild.id);

            if (!channelSetting) return;
    
            const channel = this.newMember.guild.channels.cache.find(x => x.name == channelSetting);
    
            if (!channel) return;
    
            const guildChannel = channel as TextChannel;
    
            await guildChannel.send({ embeds: [embed ]});
    }
}