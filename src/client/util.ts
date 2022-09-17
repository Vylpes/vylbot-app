// Required Components
import { Client, Message, REST, Routes, SlashCommandBuilder } from "discord.js";
import { ICommandContext } from "../contracts/ICommandContext";
import ICommandItem from "../contracts/ICommandItem";
import IEventItem from "../contracts/IEventItem";
import SettingsHelper from "../helpers/SettingsHelper";
import StringTools from "../helpers/StringTools";
import { CommandResponse } from "../constants/CommandResponse";
import ErrorMessages from "../constants/ErrorMessages";
import { CoreClient } from "./client";

// Util Class
export class Util {
    public loadSlashCommands(client: Client) {
        const registeredCommands = CoreClient.commandItems;

        const globalCommands = registeredCommands.filter(x => !x.ServerId);
        const guildCommands = registeredCommands.filter(x => x.ServerId);

        const globalCommandData: SlashCommandBuilder[] = globalCommands
            .filter(x => x.Command.CommandBuilder)
            .flatMap(x => x.Command.CommandBuilder);

        const guildIds: string[] = [];

        for (let command of guildCommands) {
            if (!guildIds.find(x => x == command.ServerId)) {
                guildIds.push(command.ServerId!);
            }
        }

        const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);

        rest.put(
            Routes.applicationCommands(process.env.BOT_CLIENTID!),
            {
                body: globalCommandData
            }
        );

        for (let guild of guildIds) {
            const guildCommandData = guildCommands.filter(x => x.ServerId == guild)
                .filter(x => x.Command.CommandBuilder)
                .flatMap(x => x.Command.CommandBuilder);

            if (!client.guilds.cache.has(guild)) continue;
            
            rest.put(
                Routes.applicationGuildCommands(process.env.BOT_CLIENTID!, guild),
                {
                    body: guildCommandData
                }
            )
        }
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
