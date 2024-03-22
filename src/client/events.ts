import { Interaction } from "discord.js";
import ChatInputCommand from "./interactionCreate/chatInputCommand";
import Button from "./interactionCreate/button";

export class Events {
    public async onInteractionCreate(interaction: Interaction) {
        if (!interaction.guildId) return;

        if (interaction.isChatInputCommand()) {
            ChatInputCommand.onChatInput(interaction);
        } else if (interaction.isButton()) {
            Button.onButtonClicked(interaction);
        } else {
            console.error("Received interaction unable to interact with, ignoring");
        }
    }

    // Emit when bot is logged in and ready to use
    public onReady() {
        console.log("Ready");
    }
}
