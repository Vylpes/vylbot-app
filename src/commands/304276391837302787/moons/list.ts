import {ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder} from "discord.js";
import Moon from "../../../database/entities/304276391837302787/Moon";
import EmbedColours from "../../../constants/EmbedColours";
import UserSetting from "../../../database/entities/UserSetting";

export default async function ListMoons(interaction: CommandInteraction) {
    const user = interaction.options.get("user")?.user ?? interaction.user;
    const page = interaction.options.get("page")?.value as number ?? 0;

    const pageLength = 10;

    const moons = await Moon.FetchPaginatedMoonsByUserId(user.id, pageLength, page);

    if (!moons || moons[0].length == 0) {
        await interaction.reply(`${user.username} does not have any moons or page is invalid.`);
        return;
    }

    const moonSetting = await UserSetting.FetchOneByKey(interaction.user.id, "moons");
    const totalMoons = moonSetting && Number(moonSetting.Value) ? Number(moonSetting.Value) : 0;

    const totalPages = Math.ceil(moons[1] / pageLength);

    const description = moons[0].flatMap(x => `**${x.MoonNumber} -** ${x.Description.slice(0, 15)}`);

    const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Moons`)
        .setColor(EmbedColours.Ok)
        .setDescription(description.join("\n"))
        .setFooter({ text: `Page ${page + 1} of ${totalPages} · ${totalMoons} moons` });

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`moons list ${user.id} ${page - 1}`)
                .setLabel("Previous")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page == 0),
            new ButtonBuilder()
                .setCustomId(`moons list ${user.id} ${page + 1}`)
                .setLabel("Next")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page + 1 == totalPages));

    await interaction.reply({
        embeds: [ embed ],
        components: [ row ],
    });
}
