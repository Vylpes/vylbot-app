import { Command } from "../type/command";
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import EmbedColours from "../constants/EmbedColours";
import axios from "axios";

interface RabbitApiResponse {
    _id: string;
    breed: string;
    url: string;
    urlId: string;
}

const RABBIT_API_URL = "https://rabbit-api-two.vercel.app/api/random";

export default class Bunny extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName("bunny")
            .setDescription("Get a random picture of a rabbit.");
    }

    public override async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        await interaction.deferReply();

        try {
            const { data } = await axios.get<RabbitApiResponse>(RABBIT_API_URL);

            if (!data?.url) {
                await interaction.editReply("Sorry, I couldn't fetch a bunny image right now. Please try again later.");
                return;
            }

            const fetchedImageData = await axios.get(data.url, {
                responseType: "stream",
            });
            const image = new AttachmentBuilder(fetchedImageData.data, { name: "bunny.png" });

            const breedTitle = data.breed
                ? data.breed
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "Bunny";

            const embed = new EmbedBuilder()
                .setColor(EmbedColours.Ok)
                .setTitle(breedTitle)
                .setImage("attachment://bunny.png")
                .setFooter({ text: "via Rabbit API" });

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`bunny delete ${interaction.user.id}`)
                        .setLabel("Delete")
                        .setStyle(ButtonStyle.Danger));

            await interaction.editReply({ embeds: [ embed ], files: [ image ], components: [ row ] });
        } catch {
            await interaction.editReply("Sorry, I couldn't fetch a bunny image right now. Please try again later.");
        }
    }
}
