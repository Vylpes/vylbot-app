import { CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import Server from "../database/entities/Server";
import { Command } from "../type/command";

export default class Setup extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName('setup')
            .setDescription('Makes the server ready to be configured')
            .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.guildId) return;

        const server = await Server.FetchOneById(Server, interaction.guildId);

        if (server) {
            await interaction.reply('This server has already been setup, please configure using the config command.');
            return;
        }

        const newServer = new Server(interaction.guildId);

        await newServer.Save(Server, newServer);

        await interaction.reply('Success, please configure using the configure command.');
    }
}