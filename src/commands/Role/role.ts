import { CommandInteraction, EmbedBuilder, GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import { Command } from "../../type/command";
import { default as eRole } from "../../database/entities/Role";
import EmbedColours from "../../constants/EmbedColours";

export default class Role extends Command {
    constructor() {
        super();

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('role')
            .setDescription('Toggle your roles')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('toggle')
                    .setDescription('Toggle your role')
                    .addRoleOption(option =>
                        option
                            .setName('role')
                            .setDescription('The role name')
                            .setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('list')
                    .setDescription('List togglable roles'));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.options.getSubcommand()) {
            case 'toggle':
                await this.ToggleRole(interaction);
                break;
            case 'list':
                await this.SendRolesList(interaction);
                break;
            default:
                await interaction.reply('Subcommand not found.');
        }
    }

    private async SendRolesList(interaction: CommandInteraction) {
        const roles = await this.GetRolesList(interaction);

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle("Roles")
            .setDescription(`Roles: ${roles.length}\n\n${roles.join("\n")}`);

        await interaction.reply({ embeds: [ embed ]});
    }

    private async ToggleRole(interaction: CommandInteraction) {
        if (!interaction.guild) return;
        if (!interaction.member) return;

        const roles = await this.GetRolesList(interaction);
        const requestedRole = interaction.options.get('role');

        if (!requestedRole || !requestedRole.role) {
            await interaction.reply('Fields are required.');
            return;
        }

        if (!roles.includes(requestedRole.role.name)) {
            await interaction.reply('This role isn\'t marked as assignable.');
            return;
        }

        const roleManager = interaction.member.roles as GuildMemberRoleManager;

        const userRole = roleManager.cache.find(x => x.name == requestedRole.role!.name);
        const assignRole = interaction.guild.roles.cache.find(x => x.id == requestedRole.role!.id);

        if (!assignRole) return;

        if (!assignRole.editable) {
            await interaction.reply('Insufficient permissions. Please contact a moderator.');
            return;
        }

        if (!userRole) {
            await roleManager.add(assignRole);
            await interaction.reply(`Gave role: \`${assignRole.name}\``);
        } else {
            await roleManager.remove(assignRole);
            await interaction.reply(`Removed role: \`${assignRole.name}\``);
        }
    }

    private async GetRolesList(interaction: CommandInteraction): Promise<string[]> {
        if (!interaction.guildId || !interaction.guild) return [];

        const rolesArray = await eRole.FetchAllByServerId(interaction.guildId);

        const roles: string[] = [];

        for (let i = 0; i < rolesArray.length; i++) {
            const serverRole = interaction.guild.roles.cache.find(x => x.id == rolesArray[i].RoleId);

            if (serverRole) {
                roles.push(serverRole.name);
            }
        }

        return roles;
    }
}
