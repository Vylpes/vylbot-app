import { getConnection } from "typeorm";
import DefaultValues from "../constants/DefaultValues";
import Setting from "../entity/Setting";

export default class SettingsHelper {
    public static async GetSetting(key: string): Promise<string | undefined> {
        const connection = getConnection();

        const repository = connection.getRepository(Setting);

        const single = await repository.findOne({ Key: key });

        if (!single) {
            return DefaultValues.GetValue(key);
        }

        return single.Value;
    }

    public static async SetSetting(key: string, value: string): Promise<void> {
        const connection = getConnection();

        const repository = connection.getRepository(Setting);

        const setting = await repository.findOne({ Key: key });

        if (setting) {
            setting.UpdateBasicDetails(key, value);

            await setting.Save(Setting, setting);
        } else {
            const newSetting = new Setting(key, value);

            await newSetting.Save(Setting, newSetting);
        }
    }
}