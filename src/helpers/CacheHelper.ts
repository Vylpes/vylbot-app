import { Guild } from "discord.js";
import Server from "../database/entities/Server";

export default class CacheHelper {
    public static async UpdateServerCache(guild: Guild): Promise<boolean> {
        const cacheInterval = process.env.CACHE_INTERVAL;

        if (!cacheInterval) return false;

        let server = await Server.FetchOneById(Server, guild.id);

        if (!server) {
            server = new Server(guild.id);
            await server.Save(Server, server);

            await CacheHelper.UpdateCache(guild);

            return true;
        } else if (server.LastCached.getTime() + Number(cacheInterval) > Date.now()) {
            await CacheHelper.UpdateCache(guild);

            return true;
        }

        return false;
    }

    private static async UpdateCache(guild: Guild) {
        console.log(`Updating cache for ${guild.name} (${guild.id})`);

        await guild.members.fetch();
    }
}