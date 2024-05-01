import { Command } from "../type/command";
import randomBunny from "random-bunny";
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import EmbedColours from "../constants/EmbedColours";

export default class Bunny extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("bunny")
            .setDescription("Get a random picture of a rabbit.");
    }

    public override async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        await interaction.deferReply();

        const subreddits = [
            'rabbits',
            'bunnieswithhats',
            'buncomfortable',
            'bunnytongues',
            'dutchbunnymafia',
        ];

        const random = Math.floor(Math.random() * subreddits.length);
        const selectedSubreddit = subreddits[random];

        const result = await randomBunny(selectedSubreddit, 'hot');

        if (result.IsSuccess) {
            const embed = new EmbedBuilder()
                .setColor(EmbedColours.Ok)
                .setTitle(result.Result!.Title)
                .setDescription(result.Result!.Permalink)
                .setImage(result.Result!.Url)
                .setURL(`https://reddit.com${result.Result!.Permalink}`)
                .setFooter({ text: `r/${selectedSubreddit} · ${result.Result!.Ups} upvotes`});

            await interaction.editReply({ embeds: [ embed ]});
        } else {
            await interaction.editReply("There was an error running this command.");
        }
    }
}