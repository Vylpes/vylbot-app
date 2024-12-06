import AutoKickConfig from "../database/entities/AutoKickConfig";

export default class AutoKickHelper {
    public static async SetSetting(serverId: string, roleId: string, kickTime: number, noticeTime?: number, noticeChannelId?: string) {
        const config = await AutoKickConfig.FetchOneByServerIdAndRoleId(serverId, roleId);

        if (!config) {
            const newConfig = new AutoKickConfig(serverId, roleId, kickTime, noticeTime, noticeChannelId);
            await newConfig.Save(AutoKickConfig, newConfig);

            return;
        }

        config.UpdateBasicDetails(roleId, kickTime, noticeTime, noticeChannelId);
        await config.Save(AutoKickConfig, config);
    }

    public static async ResetSetting(serverId: string, roleId: string) {
        const config = await AutoKickConfig.FetchOneByServerIdAndRoleId(serverId, roleId);

        if (!config) return;

        await AutoKickConfig.Remove(AutoKickConfig, config);
    }
}
