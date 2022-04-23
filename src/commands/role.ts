import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Role as DiscordRole } from "discord.js";
import { Command } from "../type/command";
import { ICommandContext } from "../contracts/ICommandContext";
import ICommandReturnContext from "../contracts/ICommandReturnContext";
import SettingsHelper from "../helpers/SettingsHelper";
import { readFileSync } from "fs";
export default class Role extends Command {
    constructor() {
        super();

        super.Category = "General";
    }

    public override async execute(context: ICommandContext) {
        if (!context.message.guild) return;

        switch (context.args[0]) {
            case "config":
                await this.UseConfig(context);
                break;
            default:
                await this.UseDefault(context);
        }
    }

    // =======
    // Default
    // =======

    private async UseDefault(context: ICommandContext) {
        const roles = await SettingsHelper.GetSetting("role.assignable", context.message.guild!.id);

        if (!roles) {
            const errorEmbed = new ErrorEmbed(context, "Unable to find any assignable roles");
            errorEmbed.SendToCurrentChannel();

            return;
        }

        const rolesArray = roles.split(",");

        if (context.args.length == 0) {
            await this.SendRolesList(context, rolesArray, context.message.guild!.id);
        } else {
            await this.ToggleRole(context, rolesArray);
        }
    }

    public async SendRolesList(context: ICommandContext, roles: String[], serverId: string): Promise<ICommandReturnContext> {
        const botPrefix = await SettingsHelper.GetServerPrefix(serverId);
        const description = `Do ${botPrefix}role <role> to get the role!\n${roles.join('\n')}`;

        const embed = new PublicEmbed(context, "Roles", description);
        embed.SendToCurrentChannel();

        return {
            commandContext: context,
            embeds: [embed]
        };
    }

    public async ToggleRole(context: ICommandContext, roles: String[]): Promise<ICommandReturnContext> {
        const requestedRole = context.args.join(" ");

        if (!roles.includes(requestedRole)) {
            const errorEmbed = new ErrorEmbed(context, "This role isn't marked as assignable, to see a list of assignable roles, run this command without any parameters");
            errorEmbed.SendToCurrentChannel();

            return {
                commandContext: context,
                embeds: [errorEmbed]
            };
        }

        const assignRole = context.message.guild?.roles.cache.find(x => x.name == requestedRole);

        if (!assignRole) {
            const errorEmbed = new ErrorEmbed(context, "The current server doesn't have this role. Please contact the server's moderators");
            errorEmbed.SendToCurrentChannel();
            
            return {
                commandContext: context,
                embeds: [errorEmbed]
            };
        }

        const role = context.message.member?.roles.cache.find(x => x.name == requestedRole)

        if (!role) {
            await this.AddRole(context, assignRole);
        } else {
            await this.RemoveRole(context, assignRole);
        }

        return {
            commandContext: context,
            embeds: []
        };
    }

    public async AddRole(context: ICommandContext, role: DiscordRole): Promise<ICommandReturnContext> {
        await context.message.member?.roles.add(role, "Toggled with role command");

        const embed = new PublicEmbed(context, "", `Gave role: ${role.name}`);
        embed.SendToCurrentChannel();

        return {
            commandContext: context,
            embeds: [embed]
        };
    }

    public async RemoveRole(context: ICommandContext, role: DiscordRole): Promise<ICommandReturnContext> {
        await context.message.member?.roles.remove(role, "Toggled with role command");

        const embed = new PublicEmbed(context, "", `Removed role: ${role.name}`);
        embed.SendToCurrentChannel();

        return {
            commandContext: context,
            embeds: [embed]
        };
    }

    // ======
    // Config
    // ======

    private async UseConfig(context: ICommandContext) {
        const moderatorRole = await SettingsHelper.GetSetting("role.moderator", context.message.guild!.id);

        if (!context.message.member?.roles.cache.find(x => x.name == moderatorRole)) {
            const errorEmbed = new ErrorEmbed(context, "Sorry, you must be a moderator to be able to configure this command");
            errorEmbed.SendToCurrentChannel();

            return;
        }

        switch (context.args[1]) {
            case "add":
                await this.AddRoleConfig(context);
                break;
            case "remove":
                await this.RemoveRoleConfig(context);
                break;
            default:
                this.SendConfigHelp(context);
        }
    }

    private SendConfigHelp(context: ICommandContext) {
        const helpText = readFileSync(`${process.cwd()}/data/usage/role.txt`).toString();

        const embed = new PublicEmbed(context, "Configure Role Command", helpText);
        embed.SendToCurrentChannel();
    }

    private async AddRoleConfig(context: ICommandContext) {
        const role = context.message.guild!.roles.cache.find(x => x.id == context.args[2]);

        if (!role) {
            this.SendConfigHelp(context);
            return;
        }
        
        let setting = await SettingsHelper.GetSetting("role.assignable", context.message.guild!.id) || "";

        const settingArray = setting.split(",");

        settingArray.push(role.name);

        setting = settingArray.join(",");

        await SettingsHelper.SetSetting("role.assignable", context.message.guild!.id, setting);

        const embed = new PublicEmbed(context, "", "Added new assignable role");
        embed.SendToCurrentChannel();
    }

    private async RemoveRoleConfig(context: ICommandContext) {
        const role = context.message.guild!.roles.cache.find(x => x.id == context.args[2]);

        if (!role) {
            this.SendConfigHelp(context);
            return;
        }

        let setting = await SettingsHelper.GetSetting("role.assignable", context.message.guild!.id);

        if (!setting) return;

        const settingArray = setting.split(",");

        const index = settingArray.findIndex(x => x == role.name);

        if (index == -1) return;

        settingArray.splice(index, 1);

        setting = settingArray.join(",");

        await SettingsHelper.SetSetting("role.assignable", context.message.guild!.id, setting);

        const embed = new PublicEmbed(context, "", "Removed assignable role");
        embed.SendToCurrentChannel();
    }
}
