import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bunny from "../../src/commands/bunny";
import axios from "axios";

jest.mock("axios");

const mockAxios = axios as jest.Mocked<typeof axios>;

describe("GIVEN a successful fetch", () => {
    let interaction: ChatInputCommandInteraction;
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
        } as unknown as ChatInputCommandInteraction;

        mockAxios.get
            .mockResolvedValueOnce({
                data: {
                    _id: "abc123",
                    breed: "french lop",
                    url: "https://example.com/bunny.jpg",
                    urlId: "a9e1bb20",
                },
            } as any)
            .mockResolvedValueOnce({
                data: "image-stream-data",
            } as any);

        const bunny = new Bunny();
        await bunny.execute(interaction);
    });

    test("EXPECT interaction to be deferred", () => {
        expect(deferReplySpy).toHaveBeenCalledTimes(1);
    });

    test("EXPECT Rabbit API to be called", () => {
        expect(mockAxios.get).toHaveBeenCalledWith("https://rabbit-api-two.vercel.app/api/random");
    });

    test("EXPECT image URL to be fetched", () => {
        expect(mockAxios.get).toHaveBeenCalledWith("https://example.com/bunny.jpg", {
            responseType: "stream",
        });
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

        const embed = reply.embeds[0] as EmbedBuilder;
        expect(embed.data.title).toBe("French Lop");
        expect(embed.data.footer?.text).toBe("via Rabbit API");

        const actionRow = reply.components[0];
        expect(actionRow.components.length).toBe(1);

        const button = actionRow.components[0].data;
        expect(button.custom_id).toBe("bunny delete userId123");
        expect(button.label).toBe("Delete");
        expect(button.style).toBe(4); // ButtonStyle.Danger
    });
});

describe("GIVEN Rabbit API returns no url", () => {
    let interaction: ChatInputCommandInteraction;
    let editReplySpy: jest.Mock;

    beforeEach(async () => {
        editReplySpy = jest.fn();
        mockAxios.get.mockReset();

        interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            deferReply: jest.fn(),
            editReply: editReplySpy,
            user: {
                id: "userId123",
            },
        } as unknown as ChatInputCommandInteraction;

        mockAxios.get.mockResolvedValue({
            data: {
                _id: "abc123",
                breed: "hotot",
                url: "",
                urlId: "xyz",
            },
        } as any);

        const bunny = new Bunny();
        await bunny.execute(interaction);
    });

    test("EXPECT error message to be replied", () => {
        expect(editReplySpy).toHaveBeenCalledTimes(1);
        expect(editReplySpy).toHaveBeenCalledWith("Sorry, I couldn't fetch a bunny image right now. Please try again later.");
    });
});

describe("GIVEN Rabbit API throws an error", () => {
    let interaction: ChatInputCommandInteraction;
    let editReplySpy: jest.Mock;

    beforeEach(async () => {
        editReplySpy = jest.fn();
        mockAxios.get.mockReset();

        interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            deferReply: jest.fn(),
            editReply: editReplySpy,
            user: {
                id: "userId123",
            },
        } as unknown as ChatInputCommandInteraction;

        mockAxios.get.mockRejectedValue(new Error("API Error"));

        const bunny = new Bunny();
        await bunny.execute(interaction);
    });

    test("EXPECT error message to be replied", () => {
        expect(editReplySpy).toHaveBeenCalledTimes(1);
        expect(editReplySpy).toHaveBeenCalledWith("Sorry, I couldn't fetch a bunny image right now. Please try again later.");
    });
});

describe("GIVEN image download throws an error", () => {
    let interaction: ChatInputCommandInteraction;
    let editReplySpy: jest.Mock;

    beforeEach(async () => {
        editReplySpy = jest.fn();
        mockAxios.get.mockReset();

        interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(true),
            deferReply: jest.fn(),
            editReply: editReplySpy,
            user: {
                id: "userId123",
            },
        } as unknown as ChatInputCommandInteraction;

        mockAxios.get
            .mockResolvedValueOnce({
                data: {
                    _id: "abc123",
                    breed: "rex",
                    url: "https://example.com/bunny.jpg",
                    urlId: "xyz",
                },
            } as any)
            .mockRejectedValueOnce(new Error("Download failed"));

        const bunny = new Bunny();
        await bunny.execute(interaction);
    });

    test("EXPECT error message to be replied", () => {
        expect(editReplySpy).toHaveBeenCalledTimes(1);
        expect(editReplySpy).toHaveBeenCalledWith("Sorry, I couldn't fetch a bunny image right now. Please try again later.");
    });
});

describe("GIVEN interaction is not a chat input command", () => {
    let interaction: ChatInputCommandInteraction;

    beforeEach(async () => {
        mockAxios.get.mockClear();

        interaction = {
            isChatInputCommand: jest.fn().mockReturnValue(false),
        } as unknown as ChatInputCommandInteraction;

        const bunny = new Bunny();
        await bunny.execute(interaction);
    });

    test("EXPECT function to return early", () => {
        expect(mockAxios.get).not.toHaveBeenCalled();
    });
});
