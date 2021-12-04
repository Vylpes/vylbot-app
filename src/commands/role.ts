import { Command, ICommandContext } from "vylbot-core";
import ErrorEmbed from "../helpers/ErrorEmbed";
import PublicEmbed from "../helpers/PublicEmbed";
import { Role as DiscordRole } from "discord.js";

export default class Role extends Command {
    constructor() {
        super();

        super._category = "General";
    }

    public override execute(context: ICommandContext) {
        const roles = process.env.COMMANDS_ROLE_ROLES!.split(',');

        if (context.args.length == 0) {
            this.SendRolesList(context, roles);
        } else {
            this.ToggleRole(context, roles);
        }
    }

    private SendRolesList(context: ICommandContext, roles: String[]) {
        const description = `Do ${process.env.BOT_PREFIX}role <role> to get the role!\n${roles.join('\n')}`;

        const embed = new PublicEmbed(context, "Roles", description);
        embed.SendToCurrentChannel();
    }

    private ToggleRole(context: ICommandContext, roles: String[]) {
        const requestedRole = context.args[0];

        if (!roles.includes(requestedRole)) {
            const errorEmbed = new ErrorEmbed(context, "This role isn't marked as assignable, to see a list of assignable roles, run this command without any parameters");
            errorEmbed.SendToCurrentChannel();
            return;
        }

        const assignRole = context.message.guild?.roles.cache.find(x => x.name == requestedRole);

        if (!assignRole) {
            const errorEmbed = new ErrorEmbed(context, "The current server doesn't have this role. Please contact the server's moderators");
            errorEmbed.SendToCurrentChannel();
            return;
        }

        const role = context.message.member?.roles.cache.find(x => x.name == requestedRole)

        if (!role) {
            this.AddRole(context, assignRole);
        } else {
            this.RemoveRole(context, assignRole);
        }
    }

    private async AddRole(context: ICommandContext, role: DiscordRole) {
        await context.message.member?.roles.add(role);

        const embed = new PublicEmbed(context, "", `Gave role: ${role.name}`);
        embed.SendToCurrentChannel();
    }

    private async RemoveRole(context: ICommandContext, role: DiscordRole) {
        await context.message.member?.roles.remove(role);

        const embed = new PublicEmbed(context, "", `Removed role: ${role.name}`);
        embed.SendToCurrentChannel();
    }
}