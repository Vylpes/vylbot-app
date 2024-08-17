import { Command } from "../../type/command";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ListMoons from "./moons/list";

export default class Moons extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("moons")
            .setDescription("View and create moons")
            .addSubcommand(subcommand =>
                subcommand
                    .setName('list')
                    .setDescription('List moons you have obtained')
                    .addUserOption(option =>
                        option
                                  .setName("user")
                                  .setDescription("The user to view (Defaults to yourself)"))
                    .addNumberOption(option =>
                        option
                                    .setName("page")
                                    .setDescription("The page to start with")));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.options.getSubcommand()) {
            case "list":
                await ListMoons(interaction);
                break;
        }
    }
}
