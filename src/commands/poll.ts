import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../type/command";
import { EmbedBuilder } from "@discordjs/builders";
import EmbedColours from "../constants/EmbedColours";

export default class Poll extends Command {
    constructor() {
        super();

        super.CommandBuilder = new SlashCommandBuilder()
            .setName('poll')
            .setDescription('Run a poll, automatically adding reaction emojis as options')
            .addStringOption(option =>
                option
                    .setName('title')
                    .setDescription('Title of the poll')
                    .setRequired(true))
            .addStringOption(option =>
                option
                    .setName('option1')
                    .setDescription('Option 1')
                    .setRequired(true))
            .addStringOption(option =>
                option
                    .setName('option2')
                    .setDescription('Option 2')
                    .setRequired(true))
            .addStringOption(option =>
                option
                    .setName('option3')
                    .setDescription('Option 3'))
            .addStringOption(option =>
                option
                    .setName('option4')
                    .setDescription('Option 4'))
            .addStringOption(option =>
                option
                    .setName('option5')
                    .setDescription('Option 5'));
    }

    public override async execute(interaction: CommandInteraction) {
        const title = interaction.options.get('title');
        const option1 = interaction.options.get('option1');
        const option2 = interaction.options.get('option2');
        const option3 = interaction.options.get('option3');
        const option4 = interaction.options.get('option4');
        const option5 = interaction.options.get('option5');

        if (!title || !option1 || !option2) return;

        const description = [
            option1.value as string,
            option2.value as string,
            option3?.value as string,
            option4?.value as string,
            option5?.value as string
        ]
            .filter(x => x != null);

        const arrayOfNumbers = [
            ':one:',
            ':two:',
            ':three:',
            ':four:',
            ':five:',
        ];

        const reactionEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

        description.forEach((value, index) => {
            description[index] = `${reactionEmojis[index]} ${description[index]}`;
        });

        const embed = new EmbedBuilder()
            .setColor(EmbedColours.Ok)
            .setTitle(title.value as string)
            .setDescription(description.join('\n'))
            .setFooter({
                text: `Poll by ${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()!,
            });


        const message = await interaction.reply({ embeds: [ embed ]});

        description.forEach(async (value, index) => {
            await (await message.fetch()).react(reactionEmojis[index]);
        });
    }
}