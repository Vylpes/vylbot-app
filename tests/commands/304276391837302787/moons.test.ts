import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import Moons from "../../../src/commands/304276391837302787/moons";
import * as AddMoon from "../../../src/commands/304276391837302787/moons/add";
import * as ListMoons from "../../../src/commands/304276391837302787/moons/list";

beforeEach(() => {
    jest.resetAllMocks();
});

describe("constructor", () => {
    let moons: Moons;

    beforeEach(() => {
        moons = new Moons();
    });

    test("EXPECT CommandBuilder to be defined correctly", () => {
        expect(moons.CommandBuilder).toMatchSnapshot();
    });
});

describe("execute", () => {
    describe("GIVEN interaction is not a chat input command", () => {
        const moons = new Moons();

        let interaction: CommandInteraction;

        let listMoonsSpy: jest.SpyInstance;
        let addMoonSpy: jest.SpyInstance;

        beforeEach(async () => {
            listMoonsSpy = jest.spyOn(ListMoons, "default");
            addMoonSpy = jest.spyOn(AddMoon, "default");

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(false),
            } as unknown as CommandInteraction;

            await moons.execute(interaction);
        });

        test("EXPECT interaction.isChatInputCommand to have been called", () => {
            expect(interaction.isChatInputCommand).toHaveBeenCalledTimes(1);
        });

        test("EXPECT nothing to happen", () => {
            expect(listMoonsSpy).not.toHaveBeenCalled();
            expect(addMoonSpy).not.toHaveBeenCalled();
        });
    });

    describe("GIVEN interaction subcommand is list", () => {
        const moons = new Moons();

        let interaction: ChatInputCommandInteraction;

        let listMoonsSpy: jest.SpyInstance;

        beforeEach(async () => {
            listMoonsSpy = jest.spyOn(ListMoons, "default")
                .mockImplementation();

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                options: {
                    getSubcommand: jest.fn().mockReturnValue("list"),
                },
            } as unknown as ChatInputCommandInteraction;

            await moons.execute(interaction);
        });

        test("EXPECT interaction.options.getSubcommand to have been called", () => {
            expect(interaction.options.getSubcommand).toHaveBeenCalledTimes(1);
        });

        test("EXPECT ListMoons to be called", () => {
            expect(listMoonsSpy).toHaveBeenCalledTimes(1);
            expect(listMoonsSpy).toHaveBeenCalledWith(interaction);
        });
    });

    describe("GIVEN interaction subcommand is add", () => {
        const moons = new Moons();

        let interaction: ChatInputCommandInteraction;

        let addMoonSpy: jest.SpyInstance;

        beforeEach(async () => {
            addMoonSpy = jest.spyOn(AddMoon, "default")
                .mockImplementation();

            interaction = {
                isChatInputCommand: jest.fn().mockReturnValue(true),
                options: {
                    getSubcommand: jest.fn().mockReturnValue("add"),
                },
            } as unknown as ChatInputCommandInteraction;

            await moons.execute(interaction);
        });

        test("EXPECT interaction.options.getSubcommand to have been called", () => {
            expect(interaction.options.getSubcommand).toHaveBeenCalledTimes(1);
        });

        test("EXPECT AddMoon to be called", () => {
            expect(addMoonSpy).toHaveBeenCalledTimes(1);
            expect(addMoonSpy).toHaveBeenCalledWith(interaction);
        });
    });
});