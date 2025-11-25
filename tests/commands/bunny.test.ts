import { CommandInteraction, EmbedBuilder } from "discord.js";
import Bunny from "../../src/commands/bunny";
import randomBunny from "random-bunny";
import axios from "axios";

jest.mock("random-bunny");
jest.mock("axios");

const mockRandomBunny = randomBunny as jest.MockedFunction<typeof randomBunny>;
const mockAxios = axios as jest.Mocked<typeof axios>;

describe("GIVEN a successful fetch", () => {
    let interaction: CommandInteraction;
    let editReplySpy: jest.Mock;
    let deferReplySpy: jest.Mock;

    beforeEach(async () => {
        editReplySpy = jest.fn();
        deferReplySpy = jest.fn();

        interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            deferReply: deferReplySpy,
            editReply: editReplySpy,
            user: {
                id: "userId123",
            },
        } as unknown as CommandInteraction;

        mockRandomBunny.mockResolvedValue({
            IsSuccess: true,
            Result: {
                Url: "https://example.com/bunny.jpg",
                Title: "Cute Bunny",
                Permalink: "/r/rabbits/comments/123/cute_bunny",
                Ups: 100,
            },
        } as any);

        mockAxios.get.mockResolvedValue({
            data: "image-stream-data",
        } as any);

        const bunny = new Bunny();
        await bunny.execute(interaction);
    });

    test("EXPECT interaction to be deferred", () => {
        expect(deferReplySpy).toHaveBeenCalledTimes(1);
    });

    test("EXPECT randomBunny to be called", () => {
        expect(mockRandomBunny).toHaveBeenCalled();
    });

    test("EXPECT reply with embed, image and delete button", () => {
        expect(editReplySpy).toHaveBeenCalledTimes(1);
        
        const reply = editReplySpy.mock.calls[0][0];
        expect(reply.embeds).toBeDefined();
        expect(reply.embeds.length).toBe(1);
        expect(reply.files).toBeDefined();
        expect(reply.files.length).toBe(1);
        expect(reply.components).toBeDefined();
        expect(reply.components.length).toBe(1);
        
        const actionRow = reply.components[0];
        expect(actionRow.components.length).toBe(1);
        
        const button = actionRow.components[0].data;
        expect(button.custom_id).toBe("bunny delete userId123");
        expect(button.label).toBe("Delete");
        expect(button.style).toBe(4); // ButtonStyle.Danger
    });
});

describe("GIVEN randomBunny fails", () => {
    let interaction: CommandInteraction;
    let editReplySpy: jest.Mock;

    beforeEach(async () => {
        editReplySpy = jest.fn();

        interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            deferReply: jest.fn(),
            editReply: editReplySpy,
            user: {
                id: "userId123",
            },
        } as unknown as CommandInteraction;

        mockRandomBunny.mockResolvedValue({
            IsSuccess: false,
            Result: null,
        } as any);

        const bunny = new Bunny();
        await bunny.execute(interaction);
    });

    test("EXPECT error message to be replied", () => {
        expect(editReplySpy).toHaveBeenCalledTimes(1);
        expect(editReplySpy).toHaveBeenCalledWith("There was an error running this command.");
    });
});

describe("GIVEN randomBunny throws an error", () => {
    let interaction: CommandInteraction;
    let editReplySpy: jest.Mock;

    beforeEach(async () => {
        editReplySpy = jest.fn();

        interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            deferReply: jest.fn(),
            editReply: editReplySpy,
            user: {
                id: "userId123",
            },
        } as unknown as CommandInteraction;

        mockRandomBunny.mockRejectedValue(new Error("API Error"));

        const bunny = new Bunny();
        await bunny.execute(interaction);
    });

    test("EXPECT error message to be replied", () => {
        expect(editReplySpy).toHaveBeenCalledTimes(1);
        expect(editReplySpy).toHaveBeenCalledWith("There was an error running this command.");
    });
});

describe("GIVEN interaction is not a chat input command", () => {
    let interaction: CommandInteraction;

    beforeEach(async () => {
        mockRandomBunny.mockClear();
        
        interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
        } as unknown as CommandInteraction;

        const bunny = new Bunny();
        await bunny.execute(interaction);
    });

    test("EXPECT function to return early", () => {
        expect(mockRandomBunny).not.toHaveBeenCalled();
    });
});
