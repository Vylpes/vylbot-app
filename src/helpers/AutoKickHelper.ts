import AutoKickConfig from "../database/entities/AutoKickConfig";

export default class AutoKickHelper {
    public static async GetSetting(serverId: string): Promise<AutoKickConfig | null> {
        const configs = await AutoKickConfig.FetchAllByServerId(serverId);

        if (configs.length != 1) {
            return null;
        }
        
        return configs[0];
    }

    public static async SetSetting(serverId: string, roleId: string, kickTime: number, noticeTime?: number, noticeChannelId?: string) {
        const configs = await AutoKickConfig.FetchAllByServerId(serverId);

        if (configs.length == 0) {
            const config = new AutoKickConfig(serverId, roleId, kickTime, noticeTime, noticeChannelId);
            await config.Save(AutoKickConfig, config);

            return;
        }

        const config = configs[0];

        config.UpdateBasicDetails(roleId, kickTime, noticeTime, noticeChannelId);
        await config.Save(AutoKickConfig, config);
    }

    public static async UnsetSetting(serverId: string) {
        const configs = await AutoKickConfig.FetchAllByServerId(serverId);

        for (let config of configs) {
            await AutoKickConfig.Remove(AutoKickConfig, config);
        }
    }
}
