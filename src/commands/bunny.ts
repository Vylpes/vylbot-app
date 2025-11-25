import { Command } from "../type/command";
import randomBunny from "random-bunny";
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import EmbedColours from "../constants/EmbedColours";
import axios from "axios";
import IReturnResult from "random-bunny/dist/contracts/IReturnResult";

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

        let result: IReturnResult | null = null;
        let tries = 0;
        let validResult = false;

        try {
            do {
                result = await randomBunny(selectedSubreddit, 'hot');
                tries++;
                validResult = result.IsSuccess && result.Result != null && !result.Result!.Url.match(/imgur.com/);
            } while (tries < 5 && !validResult);
        }
        catch {
            validResult = false;
        }

        if (validResult && result != null) {
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

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`bunny delete ${interaction.user.id}`)
                        .setLabel("Delete")
                        .setStyle(ButtonStyle.Danger));

            await interaction.editReply({ embeds: [ embed ],  files: [ image ], components: [ row ]});
        } else {
            await interaction.editReply("There was an error running this command.");
        }
    }
}