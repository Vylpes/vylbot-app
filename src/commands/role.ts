import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Role as DiscordRole } from "discord.js";
import { Command } from "../type/command";
import { ICommandContext } from "../contracts/ICommandContext";
import ICommandReturnContext from "../contracts/ICommandReturnContext";
import SettingsHelper from "../helpers/SettingsHelper";
import { readFileSync } from "fs";
import { default as eRole } from "../entity/Role";
import Server from "../entity/Server";

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
        if (context.args.length == 0) {
            await this.SendRolesList(context, context.message.guild!.id);
        } else {
            await this.ToggleRole(context);
        }
    }

    public async GetRolesList(context: ICommandContext): Promise<string[]> {
        const rolesArray = await eRole.FetchAllByServerId(context.message.guild!.id);

        const stringArray: string[] = [];

        for (let i = 0; i < rolesArray.length; i++) {
            const serverRole = context.message.guild!.roles.cache.find(x => x.id == rolesArray[i].RoleId);

            if (serverRole) {
                stringArray.push(serverRole.name);
            }
        }

        return stringArray;
    }

    public async SendRolesList(context: ICommandContext, serverId: string): Promise<ICommandReturnContext> {
        const roles = await this.GetRolesList(context);

        const botPrefix = await SettingsHelper.GetServerPrefix(serverId);
        const description = roles.length == 0 ? "*no roles*" : `Do ${botPrefix}role <role> to get the role!\n\n${roles.join('\n')}`;

        const embed = new PublicEmbed(context, "Roles", description);
        embed.SendToCurrentChannel();

        return {
            commandContext: context,
            embeds: [embed]
        };
    }

    public async ToggleRole(context: ICommandContext): Promise<ICommandReturnContext> {
        const roles = await this.GetRolesList(context);
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

        const embed = new PublicEmbed(context, "", `Gave role: \`${role.name}\``);
        embed.SendToCurrentChannel();

        return {
            commandContext: context,
            embeds: [embed]
        };
    }

    public async RemoveRole(context: ICommandContext, role: DiscordRole): Promise<ICommandReturnContext> {
        await context.message.member?.roles.remove(role, "Toggled with role command");

        const embed = new PublicEmbed(context, "", `Removed role: \`${role.name}\``);
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

        const existingRole = await eRole.FetchOneByRoleId(role.id);

        if (existingRole) {
            const errorEmbed = new ErrorEmbed(context, "This role has already been setup");
            errorEmbed.SendToCurrentChannel();

            return;
        }

        const server = await Server.FetchOneById(Server, context.message.guild!.id, [
            "Roles",
        ]);

        if (!server) {
            const errorEmbed = new ErrorEmbed(context, "Server not setup, please request the server owner runs the setup command.");
            errorEmbed.SendToCurrentChannel();

            return;
        }

        const roleSetting = new eRole(role.id);

        await roleSetting.Save(eRole, roleSetting);

        server.AddRoleToServer(roleSetting);
        await server.Save(Server, server);

        const embed = new PublicEmbed(context, "", `Added \`${role.name}\` as a new assignable role`);
        embed.SendToCurrentChannel();
    }

    private async RemoveRoleConfig(context: ICommandContext) {
        const role = context.message.guild!.roles.cache.find(x => x.id == context.args[2]);

        if (!role) {
            this.SendConfigHelp(context);
            return;
        }

        const existingRole = await eRole.FetchOneByRoleId(role.id);

        if (!existingRole) {
            const errorEmbed = new ErrorEmbed(context, "Unable to find this role");
            errorEmbed.SendToCurrentChannel();

            return;
        }

        await eRole.Remove(eRole, existingRole);

        const embed = new PublicEmbed(context, "", `Removed \`${role.name}\` from the list of assignable roles`);
        embed.SendToCurrentChannel();
    }
}
