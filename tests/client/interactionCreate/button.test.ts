import Button from "../../../src/client/interactionCreate/button";
import { CoreClient } from "../../../src/client/client";
import ButtonEventItem from "../../../src/contracts/ButtonEventItem";
import { ButtonInteraction } from "discord.js";
import { ButtonEvent } from "../../../src/type/buttonEvent";

describe('onButtonClicked', () => {
    let item: ButtonEventItem;
    let interaction: ButtonInteraction;

    beforeEach(() => {
        item = {
            ButtonId: "buttonId",
            Event: {
                execute: jest.fn(),
            } as unknown as ButtonEvent,
        } as unknown as ButtonEventItem;

        interaction = {
            reply: jest.fn(),
            isButton: true,
            customId: "buttonId test",
        } as unknown as ButtonInteraction;

        CoreClient.buttonEvents = [ item ];
    });

    test("EXPECT button event to be executed", async () => {
        await Button.onButtonClicked(interaction);

        expect(item.Event.execute).toHaveBeenCalledTimes(1);
        expect(item.Event.execute).toHaveBeenCalledWith(interaction);

        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN interaction is not a button, EXEPCT nothing to happen", async () => {
        interaction = {
            reply: jest.fn(),
            isButton: false,
        } as unknown as ButtonInteraction;

        await Button.onButtonClicked(interaction);

        expect(item.Event.execute).not.toHaveBeenCalled();
        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN no button event is registered, EXPECT error", async () => {
        CoreClient.buttonEvents = [];

        await Button.onButtonClicked(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Event not found.");

        expect(item.Event.execute).not.toHaveBeenCalled();
    });

    test("GIVEN button event is not registered, EXPECT error", async () => {
        interaction.customId = "anotherButtonId test";

        await Button.onButtonClicked(interaction);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("Event not found.");

        expect(item.Event.execute).not.toHaveBeenCalled();
    });
});