import { Command } from "../../type/command";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ListMoons from "./moons/list";
import AddMoon from "./moons/add";

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
                                    .setDescription("The page to start with")))
            .addSubcommand(subcommand =>
                subcommand
                        .setName('add')
                        .setDescription('Add a moon to your count!')
                        .addStringOption(option =>
                            option
                                .setName("description")
                                .setDescription("What deserved a moon?")
                                .setRequired(true)));
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.options.getSubcommand()) {
            case "list":
                await ListMoons(interaction);
                break;
            case "add":
                await AddMoon(interaction);
                break;
        }
    }
}
