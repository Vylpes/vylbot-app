import {CommandInteraction, EmbedBuilder} from "discord.js";
import Moon from "../../../database/entities/304276391837302787/Moon";
import EmbedColours from "../../../constants/EmbedColours";
import UserSetting from "../../../database/entities/UserSetting";

export default async function AddMoon(interaction: CommandInteraction) {
    const description = interaction.options.get("description", true).value?.toString();

    if (!description || description.length > 255) {
        await interaction.reply("Name must be less than 255 characters!");
        return;
    }

    let moonSetting = await UserSetting.FetchOneByKey(interaction.user.id, "moons");
    const moonCount = moonSetting && Number(moonSetting.Value) ? Number(moonSetting.Value) : 0;

    if (moonSetting) {
        moonSetting.UpdateValue(`${moonCount + 1}`);
    } else {
       moonSetting = new UserSetting(interaction.user.id, "moons", `${moonCount + 1}`);
    }

    await moonSetting.Save(UserSetting, moonSetting);

    const allMoons = await Moon.FetchMoonCountByUserId(interaction.user.id);

    const moon = new Moon(allMoons + 1, description, interaction.user.id);

    await moon.Save(Moon, moon);

    const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.globalName} Got A Moon!`)
        .setColor(EmbedColours.Moon)
        .setDescription(`**${moon.MoonNumber} -** ${moon.Description}`)
        .setThumbnail("https://cdn.discordapp.com/emojis/374131312182689793.webp?size=96&quality=lossless");

    await interaction.reply({ embeds: [ embed ] });
}
