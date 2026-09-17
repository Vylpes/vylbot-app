import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import EmbedColours from "../constants/EmbedColours";
import { Command } from "../type/command";

export default class Say extends Command {
    constructor() {
        super();

        this.CommandBuilder = new SlashCommandBuilder()
            .setName('say')
            .setDescription('Have the bot reply with your message')
            .addStringOption(x =>
                x
                    .setName("message")
                    .setDescription("The message to repeat")
                    .setRequired(true));
    }

    public override async execute(interaction: ChatInputCommandInteraction) {
        const message = interaction.options.get("message", true);

        await interaction.reply(message.value as string);
    }
}
