import {ButtonInteraction} from "discord.js";
import {ButtonEvent} from "../type/buttonEvent";
import List from "./moons/list";

export default class Moons extends ButtonEvent {
    public override async execute(interaction: ButtonInteraction): Promise<void> {
        const action = interaction.customId.split(" ")[1];

        switch (action) {
            case "list":
                await List(interaction);
        }
    }
}
