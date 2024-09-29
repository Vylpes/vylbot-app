import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../type/command";
import UserSetting from "../../database/entities/UserSetting";

export default class MoonSet extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("moonset")
            .setDescription("Manually set a user's moons")
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addUserOption(x => x
                .setName("user")
                .setDescription("The user to set")
                .setRequired(true))
            .addNumberOption(x => x
                .setName("count")
                .setDescription("The amount the user will have")
                .setRequired(true)
                .setMinValue(0));
    }

    public override async execute(interaction: CommandInteraction) {
        const user = interaction.options.get("user", true).user!;
        const count = interaction.options.get("count", true).value! as number;
    }
}