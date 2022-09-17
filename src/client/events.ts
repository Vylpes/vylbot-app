import { GuildMemberRoleManager, Interaction } from "discord.js";
import { CommandResponse } from "../constants/CommandResponse";
import ErrorMessages from "../constants/ErrorMessages";
import ICommandItem from "../contracts/ICommandItem";
import SettingsHelper from "../helpers/SettingsHelper";
import StringTools from "../helpers/StringTools";
import { CoreClient } from "./client";

export class Events {
    public async onInteractionCreate(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.guild) return;
        if (!interaction.member) return;

        const disabledCommandsString = await SettingsHelper.GetSetting("commands.disabled", interaction.guild.id);
        const disabledCommands = disabledCommandsString?.split(",");

        if (disabledCommands?.find(x => x == interaction.commandName)) {
            interaction.reply(process.env.COMMANDS_DISABLED_MESSAGE || "This command is disabled.");

            return;
        }

        const item = CoreClient.commandItems.find(x => x.Name == interaction.commandName && !x.ServerId);
        const itemForServer = CoreClient.commandItems.find(x => x.Name == interaction.commandName && x.ServerId == interaction.guildId);

        let itemToUse: ICommandItem;

        if (!itemForServer) {
            if (!item) {
                interaction.reply('Command not found');
                return;
            }

            itemToUse = item;
        } else {
            itemToUse = itemForServer;
        }

        const requiredRoles = itemToUse.Command.Roles;

        if (interaction.member.user.id != process.env.BOT_OWNERID && interaction.member.user.id != interaction.guild.ownerId) {
            for (const i in requiredRoles) {
                const setting = await SettingsHelper.GetSetting(`role.${requiredRoles[i]}`, interaction.guildId!);

                if (!setting) {
                    interaction.reply("Unable to verify if you have this role, please contact your bot administrator");
                    return;
                }

                const roles = interaction.member.roles as GuildMemberRoleManager;

                if (!roles.cache.find(role => role.name == setting)) {
                    interaction.reply(`You require the \`${StringTools.Capitalise(setting)}\` role to run this command`);
                    return;
                }
            }
        }

        const precheckResponse = itemToUse.Command.precheck(interaction);
        const precheckAsyncResponse = await itemToUse.Command.precheckAsync(interaction);

        if (precheckResponse != CommandResponse.Ok) {
            interaction.reply(ErrorMessages.GetErrorMessage(precheckResponse));
            return;
        }

        if (precheckAsyncResponse != CommandResponse.Ok) {
            interaction.reply(ErrorMessages.GetErrorMessage(precheckAsyncResponse));
            return;
        }

        itemToUse.Command.execute(interaction);
    }

    // Emit when bot is logged in and ready to use
    public onReady() {
        console.log("Ready");
    }
}
