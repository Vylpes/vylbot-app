import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, InteractionReplyOptions,SlashCommandBuilder } from "discord.js";
import About from "../../src/commands/about";
import EmbedColours from "../../src/constants/EmbedColours";

beforeEach(() => {
    process.env = {};
});

describe('Constructor', () => {
    test('Expect values set', () => {
        const command = new About();

        expect(command.CommandBuilder).toBeDefined();

        const commandBuilder = command.CommandBuilder as SlashCommandBuilder;

        expect(commandBuilder.name).toBe("about");
        expect(commandBuilder.description).toBe("About VylBot");
    });
});

describe('Execute', () => {
    test('GIVEN ABOUT_FUNDING and ABOUT_REPO are NOT present in env var, EXPECT embed to be sent without buttons', async () => {
        // Setup
        let replyOptions: InteractionReplyOptions | undefined;

        const interaction = {
            reply: jest.fn((options: InteractionReplyOptions) => {
                replyOptions = options;
            }),
        } as unknown as CommandInteraction;

        // Execution
        process.env.BOT_VER = "VERSION";
        process.env.BOT_AUTHOR = "AUTHOR";

        const command = new About();

        await command.execute(interaction);

        // Assertion
        expect(interaction.reply).toHaveBeenCalledTimes(1);
        expect(replyOptions).toBeDefined();

        expect(replyOptions?.embeds).toBeDefined();
        expect(replyOptions?.embeds?.length).toBe(1);

        expect(replyOptions?.components).toBeDefined();
        expect(replyOptions?.components?.length).toBe(0);

        const repliedEmbed = replyOptions?.embeds![0] as EmbedBuilder;

        expect(repliedEmbed.data.color).toBe(EmbedColours.Ok);
        expect(repliedEmbed.data.title).toBe("About");
        expect(repliedEmbed.data.description).toBe("Discord Bot made by Vylpes");
        expect(repliedEmbed.data.fields?.length).toBe(2);

        const repliedEmbedVersionField = repliedEmbed.data.fields![0];

        expect(repliedEmbedVersionField.name).toBe("Version");
        expect(repliedEmbedVersionField.value).toBe("VERSION");
        expect(repliedEmbedVersionField.inline).toBeTruthy();

        const repliedEmbedAuthorField = repliedEmbed.data.fields![1];

        expect(repliedEmbedAuthorField.name).toBe("Author");
        expect(repliedEmbedAuthorField.value).toBe("AUTHOR");
        expect(repliedEmbedAuthorField.inline).toBeTruthy();
    });

    test('GIVEN ABOUT_FUNDING is present in env var, EXPECT funding button to be sent', async () => {
        // Setup
        let replyOptions: InteractionReplyOptions | undefined;

        const interaction = {
            reply: jest.fn((options: InteractionReplyOptions) => {
                replyOptions = options;
            }),
        } as unknown as CommandInteraction;

        // Execution
        process.env.BOT_VER = "VERSION";
        process.env.BOT_AUTHOR = "AUTHOR";
        process.env.ABOUT_FUNDING = "https://ko-fi.com/vylpes";

        const command = new About();

        await command.execute(interaction);

        // Assertion
        expect(replyOptions?.components?.length).toBe(1);

        const repliedRow = replyOptions?.components![0] as ActionRowBuilder<ButtonBuilder>;

        expect(repliedRow.components?.length).toBe(1);

        const repliedRowFundingComponent = repliedRow.components![0] as any;

        expect(repliedRowFundingComponent.data.url).toBe("https://ko-fi.com/vylpes");
        expect(repliedRowFundingComponent.data.label).toBe("Funding");
        expect(repliedRowFundingComponent.data.style).toBe(ButtonStyle.Link);
    });

    test('GIVEN ABOUT_REPO is present in env var, EXPECT funding button to be sent', async () => {
        // Setup
        let replyOptions: InteractionReplyOptions | undefined;

        const interaction = {
            reply: jest.fn((options: InteractionReplyOptions) => {
                replyOptions = options;
            }),
        } as unknown as CommandInteraction;

        // Execution
        process.env.BOT_VER = "VERSION";
        process.env.BOT_AUTHOR = "AUTHOR";
        process.env.ABOUT_REPO = "https://gitea.vylpes.xyz/rabbitlabs/vylbot-app";

        const command = new About();

        await command.execute(interaction);

        // Assertion
        expect(replyOptions?.components?.length).toBe(1);

        const repliedRow = replyOptions?.components![0] as ActionRowBuilder<ButtonBuilder>;

        expect(repliedRow.components?.length).toBe(1);

        const repliedRowRepoComponent = repliedRow.components![0] as any;

        expect(repliedRowRepoComponent.data.url).toBe("https://gitea.vylpes.xyz/rabbitlabs/vylbot-app");
        expect(repliedRowRepoComponent.data.label).toBe("Repo");
        expect(repliedRowRepoComponent.data.style).toBe(ButtonStyle.Link);
    });

    test('GIVEN ABOUT_REPO AND ABOUT_FUNDING is present in env var, EXPECT funding button to be sent', async () => {
        // Setup
        let replyOptions: InteractionReplyOptions | undefined;

        const interaction = {
            reply: jest.fn((options: InteractionReplyOptions) => {
                replyOptions = options;
            }),
        } as unknown as CommandInteraction;

        // Execution
        process.env.BOT_VER = "VERSION";
        process.env.BOT_AUTHOR = "AUTHOR";
        process.env.ABOUT_REPO = "https://gitea.vylpes.xyz/rabbitlabs/vylbot-app";
        process.env.ABOUT_FUNDING = "https://ko-fi.com/vylpes";

        const command = new About();

        await command.execute(interaction);

        // Assertion
        expect(replyOptions?.components?.length).toBe(1);

        const repliedRow = replyOptions?.components![0] as ActionRowBuilder<ButtonBuilder>;

        expect(repliedRow.components?.length).toBe(2);

        const repliedRowRepoComponent = repliedRow.components![0] as any;

        expect(repliedRowRepoComponent.data.url).toBe("https://gitea.vylpes.xyz/rabbitlabs/vylbot-app");
        expect(repliedRowRepoComponent.data.label).toBe("Repo");
        expect(repliedRowRepoComponent.data.style).toBe(ButtonStyle.Link);

        const repliedRowFundingComponent = repliedRow.components![1] as any;

        expect(repliedRowFundingComponent.data.url).toBe("https://ko-fi.com/vylpes");
        expect(repliedRowFundingComponent.data.label).toBe("Funding");
        expect(repliedRowFundingComponent.data.style).toBe(ButtonStyle.Link);
    });
});