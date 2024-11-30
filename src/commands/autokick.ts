import {CommandInteraction, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {Command} from "../type/command";

export default class Autokick extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("autokick")
            .setDescription("Configure the auto kick functionality")
            .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
            .addSubcommand(x => x
                .setName("set")
                .setDescription("Set the configuration")
                .addRoleOption(y => y
                    .setName("role")
                    .setDescription("The role the user needs to be auto kicked")
                    .setRequired(true))
                .addStringOption(y => y
                    .setName("kicktime")
                    .setDescription("The time with the role before being kicked (Ex: 2h 30m)")
                    .setRequired(true))
                .addStringOption(y => y
                    .setName("noticetime")
                    .setDescription("The time before being kicked when a notification is sent (Ex: 2h 30m)"))
                .addChannelOption(y => y
                    .setName("noticechannel")
                    .setDescription("The channel to send the notification to")))
            .addSubcommand(x => x
                .setName("unset")
                .setDescription("Unset the current configuration"));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand();
        
        switch (subcommand) {
            case "set":
                await this.set(interaction);
                break;
            case "unset":
                await this.unset(interaction);
                break;
        }
    }

    private async set(interaction: CommandInteraction) {
    }

    private async unset(interaction: CommandInteraction) {
    }
}
