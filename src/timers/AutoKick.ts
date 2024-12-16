import {CoreClient} from "../client/client";
import AutoKickConfig from "../database/entities/AutoKickConfig";

export default async function AutoKick() {
    const client = CoreClient.baseClient;
    const autoKickConfigs = await AutoKickConfig.FetchAll(AutoKickConfig);

    for (let config of autoKickConfigs) {
        const guild = client.guilds.cache.find(x => x.id == config.ServerId) || client.guilds.fetch(config.ServerId);
        
        if (!guild) {
            continue;
        }

        console.log(typeof guild);
    }
}
