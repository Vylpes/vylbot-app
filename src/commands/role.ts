import ErrorEmbed from "../helpers/embeds/ErrorEmbed";
import PublicEmbed from "../helpers/embeds/PublicEmbed";
import { Role as DiscordRole } from "discord.js";
import { Command } from "../type/command";
import { ICommandContext } from "../contracts/ICommandContext";
import ICommandReturnContext from "../contracts/ICommandReturnContext";

export default class Role extends Command {
    constructor() {
        super();

        super.Category = "General";
    }

    public override async execute(context: ICommandContext) {
        const roles = process.env.COMMANDS_ROLE_ROLES!.split(',');

        if (context.args.length == 0) {
            this.SendRolesList(context, roles);
        } else {
            await this.ToggleRole(context, roles);
        }
    }

    public SendRolesList(context: ICommandContext, roles: String[]): ICommandReturnContext {
        const description = `Do ${process.env.BOT_PREFIX}role <role> to get the role!\n${roles.join('\n')}`;

        const embed = new PublicEmbed(context, "Roles", description);
        embed.SendToCurrentChannel();

        return {
            commandContext: context,
            embeds: [embed]
        };
    }

    public async ToggleRole(context: ICommandContext, roles: String[]): Promise<ICommandReturnContext> {
        const requestedRole = context.args[0];

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
}