// Required Components
import { Client, Message } from "discord.js";
import { readdirSync, existsSync } from "fs";
import { IBaseResponse } from "../contracts/IBaseResponse";
import { Command } from "../type/command";
import { Event } from "../type/event";
import { ICommandContext } from "../contracts/ICommandContext";
import ICommandItem from "../contracts/ICommandItem";
import IEventItem from "../contracts/IEventItem";

export interface IUtilResponse extends IBaseResponse {
    context?: {
        name: string;
        args: string[];
        message: Message;
    }
}

// Util Class
export class Util {
    public loadCommand(name: string, args: string[], message: Message, commands: ICommandItem[]): IUtilResponse {
        if (!message.member) return {
            valid: false,
            message: "Member is not part of message",
        };

        const disabledCommands = process.env.COMMANDS_DISABLED?.split(',');

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
            if (!message.member.roles.cache.find(role => role.name == requiredRoles[i])) {
                message.reply(`You require the \`${requiredRoles[i]}\` role to run this command`);

                return {
                    valid: false,
                    message: `You require the \`${requiredRoles[i]}\` role to run this command`
                };
            }
        }

        const context: ICommandContext = {
            name: name,
            args: args,
            message: message
        };

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