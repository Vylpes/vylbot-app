import { CommandInteraction, EmbedBuilder, GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import { Command } from "../type/command";
import SettingsHelper from "../helpers/SettingsHelper";
import { default as eRole } from "../entity/Role";
import EmbedColours from "../constants/EmbedColours";

export default class Role extends Command {
    constructor() {
        super();

        super.Category = "General";

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('role')
            .setDescription('Toggle your roles')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('config')
                    .setDescription('Configure the roles')
                    .addStringOption(option =>
                        option
                            .setName('role')
                            .setDescription('The role name')
                            .setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('toggle')
                    .setDescription('Toggle your role')
                    .addStringOption(option =>
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
            case 'config':
                await this.Configure(interaction);
                break;
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

        if (!requestedRole || !requestedRole.value) {
            await interaction.reply('Fields are required.');
            return;
        }

        if (!roles.includes(requestedRole.value.toString())) {
            await interaction.reply('This role isn\'t marked as assignable.');
            return;
        }

        const assignRole = interaction.guild.roles.cache.find(x => x.name == requestedRole.value);

        if (!assignRole) {
            await interaction.reply('The current server doesn\'t have this role. Please contact the server\'s moderators');
            return;
        }

        const roleManager = interaction.member.roles as GuildMemberRoleManager;

        const role = roleManager.cache.find(x => x.name == requestedRole.value);

        if (!role) {
            await roleManager.add(assignRole);
            await interaction.reply(`Gave role: \`${assignRole.name}\``);
        } else {
            await roleManager.remove(assignRole);
            await interaction.reply(`Removed role: \`${assignRole.name}\``);
        }
    }

    private async Configure(interaction: CommandInteraction) {
        if (!interaction.guildId || !interaction.guild) return;
        if (!interaction.member) return;

        const roleName = interaction.options.get('role');

        if (!roleName || !roleName.value) {
            await interaction.reply('Fields are required.');
            return;
        }

        const roleManager = interaction.member.roles as GuildMemberRoleManager;

        const moderatorRole = await SettingsHelper.GetSetting("role.moderator", interaction.guildId);

        if (!roleManager.cache.find(x => x.name == moderatorRole)) {
            await interaction.reply('Sorry, you must be a moderator to be able to configure this command.');
            return;
        }

        const role = interaction.guild.roles.cache.find(x => x.name == roleName.value);

        if (!role) {
            await interaction.reply('Unable to find role.');
            return;
        }

        const existingRole = await eRole.FetchOneByRoleId(role.id);

        if (existingRole) {
            await eRole.Remove(eRole, existingRole);
            await interaction.reply('Removed role from configuration.');
        } else {
            const newRole = new eRole(role.id);
            await newRole.Save(eRole, newRole);
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
