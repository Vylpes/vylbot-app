import { ButtonInteraction } from "discord.js";
import Moons from "../../../src/buttonEvents/304276391837302787/moons";
import * as List from "../../../src/buttonEvents/304276391837302787/moons/list";

describe("GIVEN interaction action is list", () => {
    const interaction = {
        customId: "moons list",
    } as unknown as ButtonInteraction;

    const listSpy = jest.spyOn(List, "default");

    beforeAll(async () => {
        const moons = new Moons();
        await moons.execute(interaction);
    });

    test("EXPECT List function to be called", () => {
        expect(listSpy).toHaveBeenCalledTimes(1);
        expect(listSpy).toHaveBeenCalledWith(interaction);
    });
});