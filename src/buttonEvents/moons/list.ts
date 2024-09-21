import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder} from "discord.js";
import Moon from "../../database/entities/304276391837302787/Moon";
import EmbedColours from "../../constants/EmbedColours";

export default async function List(interaction: ButtonInteraction) {
    if (!interaction.guild) return;

    const userId = interaction.customId.split(" ")[2];
    const page = interaction.customId.split(" ")[3];

    if (!userId || !page) return;

    const pageNumber = Number(page);

    const member = interaction.guild.members.cache.find(x => x.user.id == userId);

    const pageLength = 10;

    const moons = await Moon.FetchPaginatedMoonsByUserId(userId, pageLength, pageNumber);

    if (!moons || moons[0].length == 0) {
        await interaction.reply(`${member?.user.username ?? "This user"} does not have any moons or page is invalid.`);
        return;
    }

    const totalPages = Math.ceil(moons[1] / pageLength);

    const description = moons[0].flatMap(x => `**${x.MoonNumber} -** ${x.Description.slice(0, 15)}`);

    const embed = new EmbedBuilder()
        .setTitle(`${member?.user.username}'s Moons`)
        .setColor(EmbedColours.Ok)
        .setDescription(description.join("\n"))
        .setFooter({ text: `Page ${page + 1} of ${totalPages} · ${moons[1]} moons` });

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`moons list ${userId} ${pageNumber - 1}`)
                .setLabel("Previous")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(pageNumber == 0),
            new ButtonBuilder()
                .setCustomId(`moons list ${userId} ${pageNumber + 1}`)
                .setLabel("Next")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(pageNumber + 1 == totalPages));

    await interaction.update({
        embeds: [ embed ],
        components: [ row ],
    });
}
