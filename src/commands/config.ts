import { Guild } from "discord.js";
import { readFileSync } from "fs";
import { CommandResponse } from "../constants/CommandResponse";
import DefaultValues from "../constants/DefaultValues";
import { ICommandContext } from "../contracts/ICommandContext";
import ICommandReturnContext from "../contracts/ICommandReturnContext";
import Server from "../entity/Server";
import Setting from "../entity/Setting";
import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Command } from "../type/command";

export default class Config extends Command {
    constructor() {
        super();
        super.Category = "Administration";
        super.Roles = [
            "administrator"
        ]
    }

    public override async precheckAsync(context: ICommandContext): Promise<CommandResponse> {
        if (!context.message.guild) {
            return CommandResponse.ServerNotSetup;
        }

        const server = await Server.FetchOneById<Server>(Server, context.message.guild?.id, [
            "Settings",
        ]);

        if (!server) {
            return CommandResponse.ServerNotSetup;
        }

        return CommandResponse.Ok;
    }

    public override async execute(context: ICommandContext) {
        if (!context.message.guild) {
            return;
        }

        const server = await Server.FetchOneById<Server>(Server, context.message.guild?.id, [
            "Settings",
        ]);

        if (!server) {
            return;
        }

        const key = context.args[0];
        const action = context.args[1];
        const value = context.args.splice(2).join(" ");

        if (!key) {
            this.SendHelpText(context);
        } else if (!action) {
            this.GetValue(context, server, key);
        } else {
            switch(action) {
                case 'reset': 
                    this.ResetValue(context, server, key);
                    break;
                case 'set':
                    if (!value) {
                        const errorEmbed = new ErrorEmbed(context, "Value is required when setting");
                        errorEmbed.SendToCurrentChannel();
                        return;
                    }

                    this.SetValue(context, server, key, value);
                    break;
                default:
                    const errorEmbed = new ErrorEmbed(context, "Action must be either set or reset");
                    errorEmbed.SendToCurrentChannel();
                    return;
            }
        }
    }

    private async SendHelpText(context: ICommandContext) {
        const description = readFileSync(`${process.cwd()}/data/usage/config.txt`).toString();

        const embed = new PublicEmbed(context, "Config", description);

        embed.SendToCurrentChannel();
    }

    private async GetValue(context: ICommandContext, server: Server, key: string) {
        const setting = server.Settings.filter(x => x.Key == key)[0];

        if (setting) {
            const embed = new PublicEmbed(context, "", `${key}: ${setting.Value}`);
            embed.SendToCurrentChannel();
        } else {
            const embed = new PublicEmbed(context, "", `${key}: ${DefaultValues.GetValue(key)} <DEFAULT>`);
            embed.SendToCurrentChannel();
        }
    }

    private async ResetValue(context: ICommandContext, server: Server, key: string) {
        const setting = server.Settings.filter(x => x.Key == key)[0];

        if (!setting) {
            const embed = new PublicEmbed(context, "", "Setting has been reset");
            embed.SendToCurrentChannel();
            return;
        }

        await Setting.Remove(Setting, setting);

        const embed = new PublicEmbed(context, "", "Setting has been reset");
        embed.SendToCurrentChannel();
    }

    private async SetValue(context: ICommandContext, server: Server, key: string, value: string) {
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

        const embed = new PublicEmbed(context, "", "Setting has been set");
        embed.SendToCurrentChannel();
    }
}