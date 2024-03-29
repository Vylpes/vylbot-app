import DefaultValues from "../constants/DefaultValues";
import Server from "../database/entities/Server";
import Setting from "../database/entities/Setting";

export default class SettingsHelper {
    public static async GetSetting(key: string, serverId: string): Promise<string | undefined> {
        const server = await Server.FetchOneById(Server, serverId, [
            "Settings"
        ]);

        if (!server) {
            return DefaultValues.GetValue(key);
        }

        const setting = server.Settings.filter(x => x.Key == key)[0];

        if (!setting) {
            return DefaultValues.GetValue(key);
        }

        return setting.Value;
    }

    public static async SetSetting(key: string, serverId: string, value: string): Promise<void> {
        const server = await Server.FetchOneById(Server, serverId, [
            "Settings"
        ]);

        if (!server) {
            return;
        }

        const setting = server.Settings.filter(x => x.Key == key)[0];

        if (setting) {
            setting.UpdateBasicDetails(key, value);

            await setting.Save(Setting, setting);
        } else {
            const newSetting = new Setting(key, value);

            await newSetting.Save(Setting, newSetting);

            server.AddSettingToServer(newSetting);

            await server.Save(Server, server);
        }
    }

    public static async GetServerPrefix(serverId: string): Promise<string> {
        const setting = await this.GetSetting("bot.prefix", serverId);

        if (!setting) {
            return "v!";
        }

        return setting;
    }
}