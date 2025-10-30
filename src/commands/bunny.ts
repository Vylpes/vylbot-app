import { Command } from "../type/command";
import randomBunny from "random-bunny";
import { AttachmentBuilder, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import EmbedColours from "../constants/EmbedColours";
import axios from "axios";
import {createWriteStream} from "fs";

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
            const fetchedImageData = await axios.get(result.Result!.Url, {
                responseType: 'stream',
            });
            const image = new AttachmentBuilder(fetchedImageData.data, { name: "bunny.png" });

            const embed = new EmbedBuilder()
                .setColor(EmbedColours.Ok)
                .setTitle(result.Result!.Title)
                .setDescription(result.Result!.Permalink)
                .setImage("attachment://bunny.png")
                .setURL(`https://reddit.com${result.Result!.Permalink}`)
                .setFooter({ text: `r/${selectedSubreddit} · ${result.Result!.Ups} upvotes`});

            await interaction.editReply({ embeds: [ embed ],  files: [ image ]});
        } else {
            await interaction.editReply("There was an error running this command.");
        }
    }
}