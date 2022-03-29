// Required Components
import { Client, Message } from "discord.js";
import { readdirSync, existsSync } from "fs";
import { IBaseResponse } from "../contracts/IBaseResponse";
import { Command } from "../type/command";
import { Event } from "../type/event";
import { ICommandContext } from "../contracts/ICommandContext";
import ICommandItem from "../contracts/ICommandItem";
import IEventItem from "../contracts/IEventItem";
import SettingsHelper from "../helpers/SettingsHelper";
import StringTools from "../helpers/StringTools";
import { CommandResponse } from "../constants/CommandResponse";
import ErrorMessages from "../constants/ErrorMessages";

export interface IUtilResponse extends IBaseResponse {
    context?: {
        name: string;
        args: string[];
        message: Message;
    }
}

// Util Class
export class Util {
    public async loadCommand(name: string, args: string[], message: Message, commands: ICommandItem[]): Promise<IUtilResponse> {
        if (!message.member) return {
            valid: false,
            message: "Member is not part of message",
        };

        if (!message.guild) return {
            valid: false,
            message: "Message is not part of a guild",
        };

        const disabledCommandsString = await SettingsHelper.GetSetting("commands.disabled", message.guild?.id);
        const disabledCommands = disabledCommandsString?.split(",");

        if (disabledCommands?.find(x => x == name)) {
            message.reply(process.env.COMMANDS_DISABLED_MESSAGE || "This command is disabled.");

            return {
                valid: false,
                message: "Command is disabled",
            };
        }

        const folder = process.env.FOLDERS_COMMANDS;

        const item = commands.find(x => x.Name == name);

        if (!item) {
            message.reply('Command not found');

            return {
                valid: false,
                message: "Command not found"
            };
        }

        const requiredRoles = item.Command._roles;

        for (const i in requiredRoles) {
            if (message.guild) {
                const setting = await SettingsHelper.GetSetting(`role.${requiredRoles[i]}`, message.guild?.id);

                if (!setting) {
                    message.reply("Unable to verify if you have this role, please contact your bot administrator");

                    return {
                        valid: false,
                        message: "Unable to verify if you have this role, please contact your bot administrator"
                    };
                }

                if (!message.member.roles.cache.find(role => role.name == setting)) {
                    message.reply(`You require the \`${StringTools.Capitalise(setting)}\` role to run this command`);

                    return {
                        valid: false,
                        message: `You require the \`${StringTools.Capitalise(setting)}\` role to run this command`
                    };
                }
            }
        }

        const context: ICommandContext = {
            name: name,
            args: args,
            message: message
        };

        const precheckResponse = item.Command.precheck(context);
        const precheckAsyncResponse = await item.Command.precheckAsync(context);

        if (precheckResponse != CommandResponse.Ok) {
            message.reply(ErrorMessages.GetErrorMessage(precheckResponse));

            return {
                valid: false,
                message: ErrorMessages.GetErrorMessage(precheckResponse)
            };
        }

        if (precheckAsyncResponse != CommandResponse.Ok) {
            message.reply(ErrorMessages.GetErrorMessage(precheckAsyncResponse));

            return {
                valid: false,
                message: ErrorMessages.GetErrorMessage(precheckAsyncResponse)
            };
        }

        item.Command.execute(context);

        return {
            valid: true,
            context: context
        }
    }

    // Load the events
    loadEvents(client: Client, events: IEventItem[]): IUtilResponse {
        const folder = process.env.FOLDERS_EVENTS;

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
            client.on('message', e.Event.message);
            client.on('messageDelete', e.Event.messageDelete);
            client.on('messageUpdate', e.Event.messageUpdate);
            client.on('ready', e.Event.ready);
        });

        return {
            valid: true
        }
    }
}
