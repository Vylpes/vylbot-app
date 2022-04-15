// Required Components
import { Client, Message } from "discord.js";
import { ICommandContext } from "../contracts/ICommandContext";
import ICommandItem from "../contracts/ICommandItem";
import IEventItem from "../contracts/IEventItem";
import SettingsHelper from "../helpers/SettingsHelper";
import StringTools from "../helpers/StringTools";
import { CommandResponse } from "../constants/CommandResponse";
import ErrorMessages from "../constants/ErrorMessages";

// Util Class
export class Util {
    public async loadCommand(name: string, args: string[], message: Message, commands: ICommandItem[]) {
        if (!message.member) return;
        if (!message.guild) return;

        const disabledCommandsString = await SettingsHelper.GetSetting("commands.disabled", message.guild?.id);
        const disabledCommands = disabledCommandsString?.split(",");

        if (disabledCommands?.find(x => x == name)) {
            message.reply(process.env.COMMANDS_DISABLED_MESSAGE || "This command is disabled.");
            return;
        }

        const item = commands.find(x => x.Name == name && !x.ServerId);
        const itemForServer = commands.find(x => x.Name == name && x.ServerId == message.guild?.id);

        let itemToUse: ICommandItem;

        if (!itemForServer) {
            if (!item) {
                message.reply('Command not found');
                return;
            }

            itemToUse = item;
        } else {
            itemToUse = itemForServer;
        }

        const requiredRoles = itemToUse.Command.Roles;

        for (const i in requiredRoles) {
            if (message.guild) {
                const setting = await SettingsHelper.GetSetting(`role.${requiredRoles[i]}`, message.guild?.id);

                if (!setting) {
                    message.reply("Unable to verify if you have this role, please contact your bot administrator");
                    return;
                }

                if (!message.member.roles.cache.find(role => role.name == setting)) {
                    message.reply(`You require the \`${StringTools.Capitalise(setting)}\` role to run this command`);
                    return;
                }
            }
        }

        const context: ICommandContext = {
            name: name,
            args: args,
            message: message
        };

        const precheckResponse = itemToUse.Command.precheck(context);
        const precheckAsyncResponse = await itemToUse.Command.precheckAsync(context);

        if (precheckResponse != CommandResponse.Ok) {
            message.reply(ErrorMessages.GetErrorMessage(precheckResponse));
            return;
        }

        if (precheckAsyncResponse != CommandResponse.Ok) {
            message.reply(ErrorMessages.GetErrorMessage(precheckAsyncResponse));
            return;
        }

        itemToUse.Command.execute(context);
    }

    // Load the events
    loadEvents(client: Client, events: IEventItem[]) {
        events.forEach((e) => {
            client.on('channelCreate', e.Event.channelCreate);
            client.on('channelDelete', e.Event.channelDelete);
            client.on('channelUpdate', e.Event.channelUpdate);
            client.on('guildBanAdd', e.Event.guildBanAdd);
            client.on('guildBanRemove', e.Event.guildBanRemove);
            client.on('guildCreate', e.Event.guildCreate);
            client.on('guildMemberAdd', e.Event.guildMemberAdd);
            client.on('guildMemberRemove', e.Event.guildMemberRemove);
            client.on('guildMemberUpdate', e.Event.guildMemberUpdate);
            client.on('messageCreate', e.Event.messageCreate);
            client.on('messageDelete', e.Event.messageDelete);
            client.on('messageUpdate', e.Event.messageUpdate);
            client.on('ready', e.Event.ready);
        });
    }
}
