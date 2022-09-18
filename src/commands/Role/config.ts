import { CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { Command } from "../../type/command";
import { default as eRole } from "../../entity/Role";
import Server from "../../entity/Server";

export default class ConfigRole extends Command {
    constructor() {
        super();

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('configrole')
            .setDescription('Toggle your roles')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
            .addRoleOption(option =>
                option
                    .setName('role')
                    .setDescription('The role name')
                    .setRequired(true));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.guildId || !interaction.guild) return;
        if (!interaction.member) return;

        const role = interaction.options.get('role');

        if (!role || !role.role) {
            await interaction.reply('Fields are required.');
            return;
        }

        const existingRole = await eRole.FetchOneByRoleId(role.role.id);

        if (existingRole) {
            await eRole.Remove(eRole, existingRole);
            
            await interaction.reply('Removed role from configuration.');
        } else {
            const server = await Server.FetchOneById(Server, interaction.guildId);

            if (!server) {
                await interaction.reply('This server has not been setup.');
                return;
            }

            const newRole = new eRole(role.role.id);
            newRole.SetServer(server);
            
            await newRole.Save(eRole, newRole);

            await interaction.reply('Added role to configuration.');
        }
    }
}
