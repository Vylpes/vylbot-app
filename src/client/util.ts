// Required Components
import { Client, Message } from "discord.js";
import { readdirSync, existsSync } from "fs";
import { IBaseResponse } from "../contracts/IBaseResponse";
import { Command } from "../type/command";
import { Event } from "../type/event";
import { ICommandContext } from "../contracts/ICommandContext";

export interface IUtilResponse extends IBaseResponse {
    context?: {
        name: string;
        args: string[];
        message: Message;
    }
}

// Util Class
export class Util {

    public loadCommand(name: string, args: string[], message: Message): IUtilResponse {
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

        if (existsSync(`${process.cwd()}/${folder}/`)) {
            if (existsSync(`${process.cwd()}/${folder}/${name}.ts`)) {
                const commandFile = require(`${process.cwd()}/${folder}/${name}.ts`).default;
                const command = new commandFile() as Command;

                const requiredRoles = command._roles;

                if (!command._category) command._category = "none";
    
                for (const i in requiredRoles) {
                    if (!message.member.roles.cache.find(role => role.name == requiredRoles[i])) {
                        message.reply(`You require the \`${requiredRoles[i]}\` role to run this command`);

                        return {
                            valid: false,
                            message: `You require the \`${requiredRoles[i]}\` role to run this command`,
                        };
                    }
                }
				
				const context: ICommandContext = {
					name: name,
					args: args,
					message: message,
				}
    
                // Run the command and pass the command context with it
                command.execute(context);

                return {
                    valid: true,
                    context: {
                        name: name,
                        args: args,
                        message: message,
                    }
                }
            } else {
                return {
                    valid: false,
                    message: "File does not exist",
                }
            }
        } else {
            return {
                valid: false,
                message: "Command folder does not exist",
            }
        }
    }

    // Load the events
    loadEvents(client: Client): IUtilResponse {
        const folder = process.env.FOLDERS_EVENTS;
		
        if (existsSync(`${process.cwd()}/${folder}/`)) {
            const eventFiles = readdirSync(`${process.cwd()}/${folder}/`);
			
            for (let i = 0; i < eventFiles.length; i++) {
                if (eventFiles[i].includes('.ts')) {
					const eventName = eventFiles[i].split('.')[0];
					
                    const file = require(`${process.cwd()}/${folder}/${eventName}.ts`);
					
                    const event = new file[eventName]() as Event;
					
					// Load events
					client.on('channelCreate', event.channelCreate);
					client.on('channelDelete', event.channelDelete);
					client.on('channelUpdate', event.channelUpdate);
					client.on('guildBanAdd', event.guildBanAdd);
					client.on('guildBanRemove', event.guildBanRemove);
					client.on('guildCreate', event.guildCreate);
					client.on('guildMemberAdd', event.guildMemberAdd);
					client.on('guildMemberRemove', event.guildMemberRemove);
					client.on('guildMemberUpdate', event.guildMemberUpdate);
					client.on('message', event.message);
					client.on('messageDelete', event.messageDelete);
					client.on('messageUpdate', event.messageUpdate);
					client.on('ready', event.ready);
                }
            }

            return {
                valid: true,
            }
        } else {
            return {
                valid: false,
                message: "Event folder does not exist",
            }
        }
    }
}
