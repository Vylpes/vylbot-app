import { EmbedBuilder } from "discord.js";
import {CoreClient} from "../client/client";
import AutoKickConfig from "../database/entities/AutoKickConfig";
import EmbedColours from "../constants/EmbedColours";

export default async function AutoKick() {
    const client = CoreClient.baseClient;
    const autoKickConfigs = await AutoKickConfig.FetchAll(AutoKickConfig);

    for (let config of autoKickConfigs) {
        const guild = client.guilds.cache.find(x => x.id == config.ServerId) || await client.guilds.fetch(config.ServerId);

        if (!guild) {
            continue;
        }

        await guild.members.fetch();

        const role = guild.roles.cache.find(x => x.id == config.RoleId);

        if (!role) {
            continue;
        }

        for (let memberEntity of role.members) {
            const member = memberEntity[1];

            if (!member.kickable) {
                continue;
            }

            const whenToKick = new Date(member.joinedTimestamp! + config.KickTime);
            const now = new Date();

            if (whenToKick < now) {
                await member.kick("Auto Kicked");

                if (config.NoticeChannelId) {
                    const channel = guild.channels.cache.find(x => x.id == config.NoticeChannelId) || await guild.channels.fetch(config.NoticeChannelId);

                    if (!channel?.isSendable()) {
                        continue;
                    }

                    const embed = new EmbedBuilder()
                        .setTitle("Auto Kicked User")
                        .setColor(EmbedColours.Danger)
                        .setThumbnail(member.user.avatarURL())
                        .addFields([
                            {
                                name: "User",
                                value: `<@${member.user.id}> \`${member.user.username}\``,
                                inline: true,
                            },
                        ]);

                    await channel.send({
                        embeds: [ embed ],
                    });
                }
            } else if (config.NoticeChannelId && config.NoticeTime) {
                const whenToNotice = new Date(whenToKick.getTime() - config.NoticeTime);

                const channel = guild.channels.cache.find(x => x.id == config.NoticeChannelId) || await guild.channels.fetch(config.NoticeChannelId);

                if (!channel?.isSendable()) {
                    continue;
                }

                if (now.getMonth() == whenToNotice.getMonth()
                    && now.getDate() == whenToNotice.getDate()
                    && now.getHours() == whenToNotice.getHours()) {
                    const embed = new EmbedBuilder()
                        .setTitle("Auto Kick Notice")
                        .setColor(EmbedColours.Warning)
                        .setThumbnail(member.user.avatarURL())
                        .addFields([
                            {
                                name: "User",
                                value: `<@${member.user.id}> \`${member.user.username}\``,
                                inline: true,
                            },
                            {
                                name: "When To Kick",
                                value: `<t:${Math.round(whenToKick.getTime() / 1000)}:R>`,
                                inline: true,
                            },
                        ]);

                    await channel.send({
                        embeds: [ embed ],
                    });
                }
            }
        }
    }
}
