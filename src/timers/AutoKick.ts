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
            console.error("Guild not found");

            continue;
        }

        await guild.members.fetch();

        const role = guild.roles.cache.find(x => x.id == config.RoleId);

        if (!role) {
            console.error("Role not found in guild");

            continue;
        }

        for (let memberEntity of role.members) {
            const member = memberEntity[1];

            if (!member.kickable) {
                console.error("Member not kickable");

                continue;
            }

            const whenToKick = new Date(member.joinedTimestamp! + config.KickTime);
            const now = new Date();

            if (whenToKick < now) {
                await member.kick("Auto Kicked");

                if (config.NoticeChannelId) {
                    const channel = guild.channels.cache.find(x => x.id == config.NoticeChannelId) || await guild.channels.fetch(config.NoticeChannelId);

                    if (!channel?.isSendable()) {
                        console.log("Channel not sendable");

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
                whenToNotice.setMinutes(0, 0, 0);
                whenToNotice.setHours(whenToNotice.getHours() + 1);

                const channel = guild.channels.cache.find(x => x.id == config.NoticeChannelId) || await guild.channels.fetch(config.NoticeChannelId);

                if (!channel?.isSendable()) {
                    console.error("Channel not sendable");

                    continue;
                }

                if (now.getMonth() == whenToNotice.getMonth()
                    && now.getDate() == whenToNotice.getDate()
                    && now.getHours() == whenToNotice.getHours()) {

                    const nextHour = new Date(whenToKick);
                    nextHour.setMinutes(0, 0, 0);
                    nextHour.setHours(whenToKick.getHours() + 1);

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
                                value: `<t:${Math.round(nextHour.getTime() / 1000)}:R>`,
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
