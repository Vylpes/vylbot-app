import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Bunny from "../../src/commands/bunny";
import * as randomBunny from "random-bunny";
import { EmbedBuilder } from "@discordjs/builders";
import EmbedColours from "../../src/constants/EmbedColours";

beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
})

describe('constructor', () => {
    test("EXPECT properties to be set", () => {
        const bunny = new Bunny();

        expect(bunny.CommandBuilder).toBeDefined();

        const commandBuilder = bunny.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("bunny");
        expect(commandBuilder.description).toBe("Get a random picture of a rabbit.");
    });
});

describe('execute', () => {
    test("EXPECT embed to be sent", async () => {
        let repliedWith;

        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            reply: jest.fn().mockImplementation((options) => {
                repliedWith = options;
            }),
        } as unknown as CommandInteraction;

        jest.spyOn(randomBunny, "default").mockResolvedValue({
            IsSuccess: true,
            Result: {
                Title: "title",
                Permalink: "/r/permalink",
                Url: "https://permalink.com/url.png",
                Ups: 1,
                Archived: false,
                Downs: 1,
                Hidden: false,
                Subreddit: "rabbits",
                SubredditSubscribers: 1,
            },
        });

        Math.floor = jest.fn().mockReturnValue(0);

        const bunny = new Bunny();
        await bunny.execute(interaction);

        expect(randomBunny.default).toHaveBeenCalledTimes(1);
        expect(randomBunny.default).toHaveBeenCalledWith("rabbits", "hot");

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(repliedWith).toBeDefined();
        expect(repliedWith!.embeds).toBeDefined();
        expect(repliedWith!.embeds.length).toBe(1);

        const embed = repliedWith!.embeds[0] as EmbedBuilder;

        expect(embed.data.color).toBe(EmbedColours.Ok);
        expect(embed.data.title).toBe("title");
        expect(embed.data.description).toBe("/r/permalink");
        expect(embed.data.image).toBeDefined();
        expect(embed.data.image!.url).toBe("https://permalink.com/url.png");
        expect(embed.data.url).toBe("https://reddit.com/r/permalink");
        expect(embed.data.footer).toBeDefined();
        expect(embed.data.footer!.text).toBe("r/rabbits · 1 upvotes");
    });

    test("GIVEN interaction is not a chat input command, EXPECT nothing to happen", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        const bunny = new Bunny();
        await bunny.execute(interaction);

        expect(interaction.reply).not.toHaveBeenCalled();
    });

    test("GIVEN a result from random-bunny is failure, EXPECT error", async () => {
        const interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            reply: jest.fn(),
        } as unknown as CommandInteraction;

        jest.spyOn(randomBunny, "default").mockResolvedValue({
            IsSuccess: false,
            Result: undefined
        });

        Math.floor = jest.fn().mockReturnValue(0);

        const bunny = new Bunny();
        await bunny.execute(interaction);

        expect(randomBunny.default).toHaveBeenCalledTimes(1);

        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(interaction.reply).toHaveBeenCalledWith("There was an error running this command.");
    });
});